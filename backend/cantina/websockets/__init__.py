from flask import Flask
from flask_socketio import SocketIO

from .products_dispatch import ProductsDispatch


def init_websockets(app: Flask, socketio: SocketIO):
    socketio.on_namespace(ProductsDispatch("/products_dispatch", app))
