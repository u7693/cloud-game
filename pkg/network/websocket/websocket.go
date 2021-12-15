package websocket

import (
	"crypto/tls"
	"errors"
	"net"
	"net/http"
	"net/url"
	"sync"
	"time"

	"github.com/giongto35/cloud-game/v2/pkg/logger"
	"github.com/gorilla/websocket"
)

const (
	maxMessageSize = 10 * 1024
	pingTime       = pongTime * 9 / 10
	pongTime       = 5 * time.Second
	writeWait      = 1 * time.Second
)

type WS struct {
	conn deadlinedConn
	send chan []byte

	OnMessage WSMessageHandler

	pingPong bool

	once   sync.Once
	Done   chan struct{}
	closed bool
	log    *logger.Logger
}

type WSMessageHandler func(message []byte, err error)

type Upgrader struct {
	websocket.Upgrader

	origin string
}

var DefaultUpgrader = Upgrader{
	Upgrader: websocket.Upgrader{
		ReadBufferSize:    1024,
		WriteBufferSize:   1024,
		WriteBufferPool:   &sync.Pool{},
		EnableCompression: true,
	},
}

func NewUpgrader(origin string) Upgrader {
	u := DefaultUpgrader
	switch {
	case origin == "*":
		u.CheckOrigin = func(r *http.Request) bool { return true }
	case origin != "":
		u.CheckOrigin = func(r *http.Request) bool { return r.Header.Get("Origin") == origin }
	}
	return u
}

func (u *Upgrader) Upgrade(w http.ResponseWriter, r *http.Request, responseHeader http.Header) (*websocket.Conn, error) {
	if u.origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", u.origin)
	}
	return u.Upgrader.Upgrade(w, r, responseHeader)
}

// reader pumps messages from the websocket connection to the OnMessage callback.
// Blocking, must be called as goroutine. Serializes all websocket reads.
func (ws *WS) reader() {
	defer func() {
		ws.closed = true
		close(ws.send)
		ws.shutdown()
	}()

	ws.conn.setup(func(conn *websocket.Conn) {
		conn.SetReadLimit(maxMessageSize)
		_ = conn.SetReadDeadline(time.Now().Add(pongTime))
		if ws.pingPong {
			conn.SetPongHandler(func(string) error { _ = conn.SetReadDeadline(time.Now().Add(pongTime)); return nil })
		} else {
			conn.SetPingHandler(func(string) error {
				_ = conn.SetReadDeadline(time.Now().Add(pongTime))
				err := conn.WriteControl(websocket.PongMessage, []byte{}, time.Now().Add(writeWait))
				if err == websocket.ErrCloseSent {
					return nil
				} else if e, ok := err.(net.Error); ok && e.Temporary() {
					return nil
				}
				return err
			})
		}
	})
	for {
		message, err := ws.conn.read()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				ws.log.Error().Err(err).Msg("WebSocket read fail")
			}
			break
		}
		ws.OnMessage(message, err)
	}
}

// writer pumps messages from the send channel to the websocket connection.
// Blocking, must be called as goroutine. Serializes all websocket writes.
func (ws *WS) writer() {
	var ticker *time.Ticker
	if ws.pingPong {
		ticker = time.NewTicker(pingTime)
	}
	defer func() {
		if ticker != nil {
			ticker.Stop()
		}
		ws.shutdown()
	}()
	if ws.pingPong {
		for {
			select {
			case message, ok := <-ws.send:
				if !ws.handleMessage(message, ok) {
					return
				}
			case <-ticker.C:
				if err := ws.conn.write(websocket.PingMessage, nil); err != nil {
					return
				}
			}
		}
	} else {
		for message := range ws.send {
			if !ws.handleMessage(message, true) {
				return
			}
		}
	}
}

func (ws *WS) handleMessage(message []byte, ok bool) bool {
	if !ok {
		_ = ws.conn.write(websocket.CloseMessage, []byte{})
		return false
	}
	if err := ws.conn.write(websocket.TextMessage, message); err != nil {
		return false
	}
	return true
}

// NewServer initializes new websocket peer requests handler.
func NewServer(w http.ResponseWriter, r *http.Request, log *logger.Logger) (*WS, error) {
	conn, err := DefaultUpgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}
	return newSocket(conn, true, log), nil
}

func NewServerWithConn(conn *websocket.Conn, log *logger.Logger) (*WS, error) {
	if conn == nil {
		return nil, errors.New("null connection")
	}
	return newSocket(conn, true, log), nil
}

func NewClient(address url.URL, log *logger.Logger) (*WS, error) {
	dialer := websocket.DefaultDialer
	if address.Scheme == "wss" {
		dialer.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	}
	conn, _, err := dialer.Dial(address.String(), nil)
	if err != nil {
		return nil, err
	}
	return newSocket(conn, false, log), nil
}

func newSocket(conn *websocket.Conn, pingPong bool, log *logger.Logger) *WS {
	// graceful shutdown ( ಠ_ಠ )
	shut := sync.WaitGroup{}
	shut.Add(2)

	safeConn := deadlinedConn{sock: conn, wt: writeWait}

	ws := &WS{
		conn:      safeConn,
		send:      make(chan []byte),
		once:      sync.Once{},
		Done:      make(chan struct{}, 1),
		pingPong:  pingPong,
		OnMessage: func(message []byte, err error) {},
		log:       log,
	}

	return ws
}

func (ws *WS) Listen() {
	go ws.writer()
	go ws.reader()
}

func (ws *WS) Write(data []byte) {
	if !ws.closed {
		ws.send <- data
	}
}

func (ws *WS) Close() { _ = ws.conn.write(websocket.CloseMessage, []byte{}) }

func (ws *WS) shutdown() {
	ws.once.Do(func() {
		_ = ws.conn.close()
		close(ws.Done)
		ws.log.Debug().Msg("WebSocket should be closed now")
	})
}

func (ws *WS) GetRemoteAddr() net.Addr { return ws.conn.sock.RemoteAddr() }
