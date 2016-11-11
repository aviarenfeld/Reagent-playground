MAKEFLAGS = -j1

.PHONY: install install-server

bootstrap:
	npm install
	make install-server

install-server:
	node ./shell/install-server
