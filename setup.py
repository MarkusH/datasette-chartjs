import os

from setuptools import setup


def get_long_description():
    with open(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "README.md"),
        encoding="utf8",
    ) as fp:
        return fp.read()


setup(
    name="datasette-chartjs",
    description="Chart.js integration for datasette",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    author="Markus Holtermann",
    url="https://github.com/MarkusH/datasette-chartjs",
    project_urls={
        "Issues": "https://github.com/MarkusH/datasette-chartjs/issues",
        "CI": "https://github.com/MarkusH/datasette-chartjs/actions",
        "Changelog": "https://github.com/MarkusH/datasette-chartjs/blob/main/CHANGES.md",  # noqa
    },
    license="Apache License, Version 2.0",
    packages=["datasette_chartjs"],
    package_data={
        "datasette_chartjs": [
            "static/datasette-chartjs.js",
        ],
    },
    use_scm_version=True,
    entry_points={"datasette": ["chartjs = datasette_chartjs"]},
    install_requires=["datasette"],
    extras_require={"dev": ["pre-commit"], "test": ["pytest", "pytest-asyncio"]},
    setup_requires=["setuptools_scm"],
    tests_require=["datasette-chartjs[test]"],
    python_requires=">=3.6",
)
