import React from 'react';
import './Button.css';

interface ButtonProps {
    label: string;
    action: Function;
    isToggled?: boolean;
    style?: object;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    action,
    isToggled,
    style = {},
    disabled = false
}) => (
    <button
        className={ isToggled ? 'button toggled' : 'button' }
        style={ style }
        type="button"
        onClick={ () => action() }
        disabled={ disabled }
    >
        { label }
    </button>
);

export default Button;
