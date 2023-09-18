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
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';


function App(props) {
    const [word, setWord] = useState('');
    const [selectedWord, setselectedWord] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);

    const theUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    function handleSubmit(event) {
        event.preventDefault();
        setselectedWord(word);
        if (selectedWord !== word || error) {
            getSingleCacheData('dictionary', theUrl)
        }
    }
    const getSingleCacheData = async (cacheName, url) => {

        setLoading(true);
        setError(false);
        if (typeof caches === 'undefined') fatch(url);

        const cacheStorage = await caches.open(cacheName);
        const cachedResponse = await cacheStorage.match(url);

        // If no cache exists
        if (!cachedResponse || !cachedResponse.ok) {
            fatch(url)
        } else {
            return cachedResponse.json().then((item) => {
                setData(item)
                setLoading(false);
                setError(false);
            });
        }
    };



    function fatch() {
        //sent server word 
        setLoading(true);
        setError(false);
        axios.get(theUrl)
            .then(function (response) {
                setData(response.data);
                setLoading(false);
                setError(false);
                addDataIntoCache('dictionary', theUrl, response.data)
            })
            .catch(function (error) {
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
                    sx={{ borderRadius: "1rem", p: '2px 4px', display: 'flex', alignItems: 'center', background: 'rgba(100%,100%,100%,0.5)', backdropFilter: "blur(8px)" }}
                    onSubmit={handleSubmit}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Words"
                        inputProps={{ 'aria-label': 'search Words' }}
                        value={word}
                        required
                        onChange={e => setWord(e.target.value)}
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
                                            En Dictionary
                                        </Typography>
                                        <center>
                                            <Chip icon={<EmojiPeopleIcon />} component={'a'} href="https://www.heinsoe.com" label="www.heinsoe.com" variant="outlined" style={{ cursor: "pointer" }} />
                                        </center>
                                    </div>
                                </div>
                }

            </Box>
        </div >
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
                            <Chip icon={<EmojiPeopleIcon />} component={'a'} href="https://www.heinsoe.com" label="www.heinsoe.com" variant="outlined" style={{ cursor: "pointer" }} />
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

