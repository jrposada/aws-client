import { Container } from '@mui/material';
import { invoke } from '@tauri-apps/api';
import { FunctionComponent, useState } from 'react';

const HomeRoute: FunctionComponent = () => {
    const [greet, setGreet] = useState('');

    // now we can call our Command!
    invoke<string>('greet', { name: 'World' })
        // `invoke` returns a Promise
        .then((response) => setGreet(response));

    return (
        <Container
            maxWidth={false}
            sx={{
                mt: 4,
                mb: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <h1>{greet}</h1>
        </Container>
    );
};

export default HomeRoute;
