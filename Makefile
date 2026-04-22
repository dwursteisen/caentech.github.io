.PHONY: run update-program

run:
	npx astro dev --open

install:
	npm install

update-program:
	node scripts/convert-schedule.mjs "$(or $(INPUT),$(word 2,$(MAKECMDGOALS)))"

# Catch positional arguments passed after targets
%:
	@:
