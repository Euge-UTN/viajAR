import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Pruebas del inicio de sesión', () => {
  const setUsuario = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login setUsuario={setUsuario} />
      </MemoryRouter>
    );

  test('muestra error si los campos están vacíos', () => {
    renderLogin();

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    expect(
      screen.getByText('Por favor, completá todos los campos.')
    ).toBeInTheDocument();
  });

  test('muestra error si el correo no es válido', () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu correo'), {
      target: { value: 'correo-invalido' },
    });

    fireEvent.change(
      screen.getByPlaceholderText('Ingresá tu contraseña'),
      { target: { value: '12345678' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    expect(
      screen.getByText('Ingresá un correo electrónico válido.')
    ).toBeInTheDocument();
  });

  test('actualiza el usuario y navega con datos válidos', () => {
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu correo'), {
      target: { value: 'viajero@ejemplo.com' },
    });

    fireEvent.change(
      screen.getByPlaceholderText('Ingresá tu contraseña'),
      { target: { value: '12345678' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    expect(setUsuario).toHaveBeenCalledWith({
      email: 'viajero@ejemplo.com',
      nombre: 'viajero',
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
