document.getElementById('fileInput').addEventListener('change', async function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    document.getElementById('results').innerText = 'Invalid JSON file!';
    return;
  }
  let results = '';
  if (!json.entries || !json.r) {
    results = 'Invalid format. Need "r" and "entries".';
  } else {
    results = `<b>r value:</b> ${json.r}<br>`;
    for (let i = 0; i < json.entries.length; i++) {
      const entry = json.entries[i];
      results += `<hr><b>Entry ${i+1}</b><br>`;
      results += `File: ${entry.file}<br>Offset: ${entry.offset}<br>Block Hash: ${entry.block_hash}<br>`;
      // Try to fetch tx hex from blockchair if txid provided:
      if (entry.txid) {
        results += `Txid: ${entry.txid}<br>`;
        results += `<button onclick="fetchHex('${entry.txid}', ${i})">Fetch Raw Tx Hex</button><div id="hex${i}"></div>`;
      } else {
        results += 'No txid provided. Please paste raw tx hex here: <input type="text" id="txhex'+i+'" style="width:80%"><br>';
      }
    }
  }
  document.getElementById('results').innerHTML = results;
});

// This function fetches raw hex from Blockchair API for BCH:
window.fetchHex = async function(txid, idx) {
  const url = `https://api.blockchair.com/bitcoin-cash/raw/transaction/${txid}`;
  const resp = await fetch(url);
  const data = await resp.json();
  if (data && data.data && data.data[txid] && data.data[txid].raw_transaction) {
    document.getElementById(`hex${idx}`).innerHTML = `<code>${data.data[txid].raw_transaction}</code>`;
  } else {
    document.getElementById(`hex${idx}`).innerText = "Unable to fetch hex!";
  }
}
