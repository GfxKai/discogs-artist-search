import styled, { keyframes } from 'styled-components';
import { ReactComponent as VinylIcon } from '../assets/vinyl.svg';

const wobble = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const LoadingVinyl = styled(VinylIcon)`
    height: 64px;
    width: 64px;
    animation: ${ wobble } 0.4s linear infinite;
`;

export default LoadingVinyl;
