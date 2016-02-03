# oakland-tonight
A nightly event aggregator for Oakland, CA

##install

```sh
npm install
```

##build

```sh
npm run build
```

##sources

Sources are modules in `./sources` that return an array of shows in a callback value. Shows are represented in the following format:

```json
{
  "venue": "name of venue",
  "venueURL": "venue URL",
  "title": "title of show",
  "url": "show URL",
  "date": "date of show in YYYY-MM-DD format",
  "time": "[optional] time of show",
  "price": "[optional] price of show"
}
```