const fetch = require("node-fetch");
const xlsx = require("xlsx");
const Cache = require("cache");

const express = require("express");
const router = express.Router();

const cache = new Cache(24 * 60 * 60 * 1000);

function withCache(key, getData) {
  return async () => {
    const value = cache.get(key);
    if (value) {
      console.log("value in cache");
      return value;
    }

    console.log("value not in cache");
    const newValue = await getData();
    cache.put(key, newValue);
    return newValue;
  };
}

async function getData() {
  const URL =
    "https://www.santanderrio.com.ar/banco/wcm/connect/a11980fe-ca52-453c-bf18-691814a36df7/valor_cuotas.xls?MOD=AJPERES";
  const response = await fetch(URL);
  const buffer = await response.arrayBuffer();
  const data = new Uint8Array(buffer);
  const workbook = xlsx.read(data, { type: "array" });
  return workbook;
}

const getDataWithCache = withCache("historic-data", getData);

router.get("/api/data", async (req, res, next) => {
  try {
    const data = await getDataWithCache();
    res.json({ xls: data });
  } catch (err) {
    console.error(err);
    next();
  }
});

module.exports = router;
