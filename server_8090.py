import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent aggressive caching while developing
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Minimal logging to stdout
        sys.stdout.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))
        sys.stdout.flush()

if __name__ == '__main__':
    doc_root = r"G:\Mi unidad\Antigravity\Portal_Promotores"
    os.chdir(doc_root)
    port = 8090
    server_address = ('0.0.0.0', port)
    httpd = ThreadingHTTPServer(server_address, CustomHandler)
    print(f"Threading HTTP Server running on http://0.0.0.0:{port} (root: {doc_root})")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
