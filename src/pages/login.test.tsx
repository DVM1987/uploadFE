import { render, fireEvent } from '@testing-library/react';
import Login from './login';

describe('Login Component', () => {
    it('should render without crashing', () => {
        render(<Login />);
    });

    it('should handle input changes', () => {
        const { getByPlaceholderText } = render(<Login />);
        const emailInput = getByPlaceholderText('Email') as HTMLInputElement;
        const passwordInput = getByPlaceholderText('Password') as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password');
    });

    it('should handle form submission', () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Email') as HTMLInputElement;
        const passwordInput = getByPlaceholderText('Password') as HTMLInputElement;
        const loginButton = getByText('Login');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(loginButton);

        // Add your assertions here based on your form submission logic
    });
});