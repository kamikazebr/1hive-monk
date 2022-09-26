# 1hive-monk

Services, nodes and stuffs of 1Hives using Monk.io

## Installing Monk 3.3.6 (Linux based)

> For others OS check the Docs https://docs.monk.io/docs/monk-in-10

```bash
apt install monk=3.3.6 monkd=3.3.6
```

Check the version

```bash
monkd -v
```

Run the monk login

```bash
monk login
```

## Running the services

To install dependencies

```bash
yarn
```

> Tested in **yarn** version **1.22.19**

Run

```bash
yarn start
```

That will generate new yaml file based in the **celeste-backend_template.yaml** and start automatically.

> **yarn start-local** it's just used togheter with Docker Registry 2, will be one example how do that in the future.

## Checking Logs

Just run

```bash
monk logs -f
```

And choose the celeste services to see the current logs in real tiem

If you want full log just run

```bash
monk logs
```
