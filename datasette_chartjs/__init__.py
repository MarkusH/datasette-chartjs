from datasette import hookimpl


@hookimpl
def extra_css_urls(database, table, columns, view_name, datasette):
    return [
        {
            "url": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.css",  # noqa
            "sri": "sha512-/zs32ZEJh+/EO2N1b0PEdoA10JkdC3zJ8L5FTiQu82LR9S/rOQNfQN7U59U9BC12swNeRAz3HSzIL2vpp4fv3w==",  # noqa
        },
    ]


@hookimpl
def extra_js_urls(database, table, columns, view_name, datasette):
    return [
        {
            "url": "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.bundle.min.js",  # noqa
            "sri": "sha512-SuxO9djzjML6b9w9/I07IWnLnQhgyYVSpHZx0JV97kGBfTIsUYlWflyuW4ypnvhBrslz1yJ3R+S14fdCWmSmSA==",  # noqa
        },
        "/-/static-plugins/datasette_chartjs/datasette-chartjs.js",
    ]
