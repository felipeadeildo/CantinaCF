import cantina
import re
import argparse

def ip(arg_value):
    REGEX_IP = re.compile("^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$") # não foi eu que fiz.
    if not REGEX_IP.match(arg_value):
        raise argparse.ArgumentTypeError(f"IP '{arg_value}' é inválido!")
    return arg_value

def port(arg_value):
    if int(arg_value) > 65535 or int(arg_value) < 0:
        raise argparse.ArgumentTypeError(f"Porta '{arg_value}' é inválida!")
    return int(arg_value)


parser = argparse.ArgumentParser(
    formatter_class=argparse.ArgumentDefaultsHelpFormatter
)

parser.add_argument(
    "-H",
    "--host",
    type=ip,
    required=False,
    default="0.0.0.0",
    help="host do servidor.",
)
parser.add_argument(
    "-P",
    "--port",
    type=port,
    required=False,
    default=5000,
    help="porta do servidor.",
)
parser.add_argument(
    "-D", "--debug", action="store_true", help="Iniciar servidor em modo debug."
)
args = parser.parse_args()

cantina.app.run(host=args.host, port=args.port, debug=args.debug)