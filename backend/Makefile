run:
	@python run_server.py -P 80

install:
	@pip install -r requirements.txt

initdb:
	@flask --app cantina initdb

createsuperuser:
	@flask --app cantina createsuperuser