import React from 'react';
import { Paper, Typography, Chip, IconButton, Divider, ListItem, List, Tabs } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Stack } from '@mui/system';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

export default function Result(props) {
    const result = props.data
    // const result = Eg;
    return (
        <Box sx={{ pb: 12 }}>
            {result.map((r, i) =>
                <Paper key={i} square elevation={0} sx={{ p: 0 }}>
                    <Typography variant="h4" component="h2" sx={{ p: 1 }}> {r.word}</Typography>
                    {
                        r.phonetics.length > 0 ?
                            <Stack direction="row" spacing={1} sx={{flexWrap:"wrap", my: 1,p:1 }}>
                                {r.phonetics.map((p, i) =>
                                    <Phonetic key={i} sign={p.text} audio={p.audio} />
                                )}
                            </Stack>
                            : <></>
                    }
                    <Meaning meanings={r.meanings} />
                </Paper>
            )}
            <center>
                <Chip icon={<EmojiPeopleIcon />} component={'a'} href="https://www.heinsoe.com" label="www.heinsoe.com" variant="outlined" style={{ cursor: "pointer" }} />
            </center>
        </Box>
    )
}
const Phonetic = (prop) => {
    let sound = prop.audio;
    let sign = prop.sign;
    let audio = new Audio(sound)

    const start = () => {
        audio.play()
    }
    return (
        sign || sound ?
            sound === "" ?
                <Chip label={sign}
                    size="small" 
                    variant="outlined" />
                :
                <Chip
                    aria-label="Play Sound"
                    component={IconButton}
                    onClick={start}
                    icon={<VolumeUpIcon />}
                    label={sign}
                    size="small" 
                    variant="outlined"/>
            : <></>

    )
}




const Meaning = (prop) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (

        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    {
                        prop.meanings.map((m, i) =>
                            <Tab label={m.partOfSpeech} value={i} key={i} />
                        )
                    }
                </Tabs>

                {
                    prop.meanings.map((m, i) =>
                        <TabPanel value={i} key={i} sx={{p:1}}>
                            <Typography variant="h5" component="h3">{m.partOfSpeech}</Typography>
                            <Defination definitions={m.definitions} />
                        </TabPanel>
                    )
                }
            </TabContext>
        </Box>

    )
}

const Defination = (prop) => {
    return (
        <List>
            {
                prop.definitions.map((d, i) =>
                    <ListItem key={i} sx={{px:0}}>
                        <Box sx={{ mb: 3 }}>
                            {d.definition}
                            {d.example ? <Example example={d.example} /> : <></>}
                            {d.synonyms.length > 0 ? <Synonyms synonyms={d.synonyms} /> : <></>}
                        </Box>
                    </ListItem>
                )
            }
        </List>
    )
}

const Example = (prop) => {
    return (
        <Box sx={{ mt: 1, opacity: 0.5 }}><i>Eg: {prop.example}</i></Box>
    )
}
const Synonyms = (prop) => {
    return (
        <Box sx={{ mt: 1 }}>
            <small>
                <i>synonyms :<br />
                    {prop.synonyms.join(', ')}</i>
            </small>
        </Box>
    )
}
