import { Box, Divider } from '@mui/material';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import axios from 'axios';
import Result from './components/blocks';
import Loading from './components/loading';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import Chip from '@mui/material/Chip';


function App(props) {
  const [word, setWord] = useState('');
  const [selectedWord, setselectedWord] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    setWord(event.target.value);
  };


  const theUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  function handleSubmit(event) {
    event.preventDefault();
    setselectedWord(word);
    selectedWord !== word && selectedWord !== '' &&
      getDataFromCache()
  }
  const getDataFromCache = async () => {

    // List of all caches present in browser
    var names = await caches.keys()

    console.log(names.length)
    if (names.length > 0) {
      // Iterating over the list of caches
      names.forEach(async (name) => {
        // Opening that particular cache
        const cacheStorage = await caches.open(name);

        // Fetching that particular cache data
        const cachedResponse = await cacheStorage.match(theUrl);
        if (cachedResponse) {
          var data = await cachedResponse.json()

          setData(data)
          console.log(data)
        }
        else {
          fatch(theUrl)
        }
      })
    } else {
      fatch(theUrl)
    }

  };


  function fatch() {
    //sent server word 
    setLoading(true);
    axios.get(theUrl, {
      params: ''
    })
      .then(function (response) {
        setData(response.data);
        setLoading(false);
        setError(false);
        addDataIntoCache('dictionary', theUrl, response.data)
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);
        setError(error)
      })
  }
  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <Box sx={{ p: 1, position: 'sticky', top: 0, zIndex: 1 }}>
        <Paper
          elevation={4}
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', background: 'rgba(100%,100%,100%,0.5)', backdropFilter: "blur(8px)" }}
          onSubmit={handleSubmit}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Words"
            inputProps={{ 'aria-label': 'search Words' }}
            value={word}
            required
            onChange={handleChange}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>
      <Box>
        {
          loading ? <Loading />
            : error ? <ErrorBox data={error} word={selectedWord} />
              : data ? <Result data={data} />
                :
                <div style={{ zIndex: -1, position: 'fixed', opacity: "0.4", top: 0, right: 0, left: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div>
                    <Typography variant="h4" gutterBottom component="div">
                      Dictionary
                    </Typography>
                    <center>
                      <Chip component={'a'} href="https://github.com/hheinsoee/dictionary" icon={<GitHubIcon />} label="hheinsoee/dictionary" variant="outlined" style={{ cursor: "pointer" }} />
                    </center>
                  </div>
                </div>
        }

      </Box>
    </div>
  );
}

export default App;



const ErrorBox = (prop) => {
  const data = prop.data.response.data;
  const word = prop.word;
  const errMess = prop.data.message;
  // console.log(errMess);
  return (
    <Box sx={{ p: 2 }}>
      {
        data ?
          <div>
            <h1>{data.title}</h1>
            <s>{word}</s>
            <p>{data.message}</p>
            <i>{data.resolution}</i>
            <br />
            <br />
            <Divider />
            <br />
            <br />
            <center>
              <Chip component={'a'} href="https://github.com/hheinsoee/dictionary" icon={<GitHubIcon />} label="hheinsoee/dictionary" variant="outlined" style={{ cursor: "pointer" }} />
            </center>
          </div>
          : <h1>{errMess}</h1>
      }
    </Box>
  )
}

const addDataIntoCache = (cacheName, url, response) => {
  // Converting our response into Actual Response form
  const data = new Response(JSON.stringify(response));

  if ('caches' in window) {
    // Opening given cache and putting our data into it
    caches.open(cacheName).then((cache) => {
      cache.put(url, data);
    });
  }
};