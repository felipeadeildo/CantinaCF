import time
from threading import Event

from flask import Flask
from flask_jwt_extended import jwt_required
from flask_socketio import Namespace, disconnect  # type: ignore [this is defined]

from cantina import socketio


class WSocket(Namespace):
    def __init__(self, namespace: str, app: Flask, timeout: int = 300):
        self.should_run = Event()
        self.should_run.set()
        self.timeout = timeout
        self.last_ping = time.time()
        super().__init__(namespace)
        self.app = app

    def emitter(self):
        """The data loader function that will be executed in the background emitting the data every 4 seconds.

        Raises:
            NotImplementedError
        """
        raise NotImplementedError

    def background_task(self):
        with self.app.app_context():
            while self.should_run.is_set():
                if time.time() - self.last_ping > self.timeout:
                    return
                self.emitter()
                socketio.sleep(4)

    @jwt_required(locations=["query_string"])
    def on_ping(self):
        self.last_ping = time.time()
        socketio.emit("pong")

    @jwt_required(locations=["query_string"])
    def on_disconnect(self):
        self.should_run.clear()
        disconnect()

    @jwt_required(locations=["query_string"])
    def on_connect(self):
        self.should_run.set()
        socketio.start_background_task(self.background_task)
