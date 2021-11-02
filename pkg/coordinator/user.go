package coordinator

import (
	"github.com/giongto35/cloud-game/v2/pkg/api"
	"github.com/giongto35/cloud-game/v2/pkg/client"
	"github.com/giongto35/cloud-game/v2/pkg/ipc"
	"github.com/giongto35/cloud-game/v2/pkg/launcher"
	"github.com/giongto35/cloud-game/v2/pkg/logger"
)

type User struct {
	client.SocketClient

	RoomID string
	Worker *Worker
	log    *logger.Logger
}

func NewUserClient(conn *ipc.Client, log *logger.Logger) User {
	c := client.New(conn, "u", log)
	defer c.GetLogger().Info().Msg("Connect")
	return User{SocketClient: c, log: c.GetLogger()}
}

func (u *User) SetRoom(id string) { u.RoomID = id }

func (u *User) SetWorker(w *Worker) {
	u.Worker = w
	w.ChangeUserQuantityBy(1)
}

func (u *User) FreeWorker() {
	u.Worker.ChangeUserQuantityBy(-1)
	if u.Worker != nil {
		u.Worker.TerminateSession(u.Id())
	}
}

func (u *User) HandleRequests(launcher launcher.Launcher) {
	u.OnPacket(func(p ipc.InPacket) {
		switch p.T {
		case api.WebrtcInit:
			u.log.Info().Msgf("Received init_webrtc request -> relay to worker: %s", u.Worker.Id())
			go func() {
				u.HandleWebrtcInit()
				u.log.Info().Msg("Received SDP from worker -> sending back to browser")
			}()
		case api.WebrtcAnswer:
			u.log.Info().Msg("Received browser answered SDP -> relay to worker")
			go u.HandleWebrtcAnswer(p.Payload)
		case api.WebrtcIceCandidate:
			u.log.Info().Msg("Received IceCandidate from browser -> relay to worker")
			go u.HandleWebrtcIceCandidate(p.Payload)
		case api.StartGame:
			u.log.Info().Msg("Received start request from a browser -> relay to worker")
			go u.HandleStartGame(p.Payload, launcher)
		case api.QuitGame:
			u.log.Info().Msg("Received quit request from a browser -> relay to worker")
			go u.HandleQuitGame(p.Payload)
		case api.SaveGame:
			u.log.Info().Msg("Received save request from a browser -> relay to worker")
			go u.HandleSaveGame()
		case api.LoadGame:
			u.log.Info().Msg("Received load request from a browser -> relay to worker")
			go u.HandleLoadGame()
		case api.ChangePlayer:
			u.log.Info().Msg("Received update player index request from a browser -> relay to worker")
			go u.HandleChangePlayer(p.Payload)
		case api.ToggleMultitap:
			u.log.Info().Msg("Received multitap request from a browser -> relay to worker")
			go u.HandleToggleMultitap()
		}
	})
}

func (u *User) Close() {
	u.SocketClient.Close()
	u.log.Info().Msg("Disconnect")
}
