# datasette-chartjs

[![PyPI](https://img.shields.io/pypi/v/datasette-chartjs.svg)](https://pypi.org/project/datasette-chartjs/)
[![Changelog](https://img.shields.io/github/v/release/MarkusH/datasette-chartjs?include_prereleases&label=changelog)](https://github.com/MarkusH/datasette-chartjs/releases)
[![Tests](https://github.com/MarkusH/datasette-chartjs/workflows/Test/badge.svg)](https://github.com/MarkusH/datasette-chartjs/actions?query=workflow%3ATest)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/MarkusH/datasette-chartjs/blob/main/LICENSE)

Chart.js integration for datasette

## Installation

Install this plugin in the same environment as Datasette.

    $ datasette install datasette-chartjs

## Usage

Usage instructions go here.

## Development

To set up this plugin locally, first checkout the code. Then create a new virtual environment:

    $ cd datasette-chartjs
    $ python3 -mvenv venv
    (venv)$ source venv/bin/activate

Or if you are using `pipenv`:

    $ pipenv shell

Now install the dependencies and tests:

    (venv)$ pip install -e '.[dev,test]'

To run the tests:

    (venv)$ pytest

The project also uses [pre-commit](https://pre-commit.com/) for linting and formatting of source code:

    (venv)$ pre-commit install -t pre-commit -t pre-push --install-hooks