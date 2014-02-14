node-mongodb-manager
====================

## instalación

    $ npm install -g mongodb-manager

Exporta las colecciones del servidor configurado en export y las importa al servidor configurado en import.

## Ejemplo de archivo de configuración:

    {
        "export":{
            "host": "192.168.1.2:27017",
            "user": "",
            "password": ""
        },
        "import":{
            "host": "",
            "user": "",
            "password": ""
        },
        "database": "mydatabase",
        "collections": [
            "users",
            "blog"
        ]
    }

## Ejecutar vía url

    $ mdbm url http://domain.com/settings.json

## Ejecutar vía path

    $ mdbm path ./settings.json