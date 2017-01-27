#!/usr/bin/env python

import BaseHTTPServer, SimpleHTTPServer
import ssl

web_server = BaseHTTPServer.HTTPServer(('localhost', 8443), SimpleHTTPServer.SimpleHTTPRequestHandler)
web_server.socket = ssl.wrap_socket (web_server.socket, 
                                     server_side=True,
                                     certfile="host.cert",
                                     keyfile="host.key")
web_server.serve_forever()
