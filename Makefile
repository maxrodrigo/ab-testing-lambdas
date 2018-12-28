.PHONY: help clean test lint build
.DEFAULT_GOAL := help

define PRINT_HELP_PYSCRIPT
import re, sys

for line in sys.stdin:
	match = re.match(r'^((?!_)[a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef
export PRINT_HELP_PYSCRIPT

help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

clean: ## remove all test, coverage and artifacts
	@echo "+ $@"

lint: ## check style with flake8 and black
	@echo "+ $@"

test: ## run all, unit and integration tests
	@echo "+ $@"

deploy: ## build lambdas for production
	@echo "+ $@"
