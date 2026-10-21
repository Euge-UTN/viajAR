
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Registro from '../Registro';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Pruebas del registro', () => {
  const setUsuario = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderRegistro = () =>
    render(
      <MemoryRouter>
        <Registro setUsuario={setUsuario} />
      </MemoryRouter>
    );

  test('muestra errores cuando los campos están vacíos', () => {
    renderRegistro();

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrarse' })
    );

    expect(
      screen.getByText('El nombre completo es obligatorio.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('El correo electrónico es obligatorio.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('La contraseña es obligatoria.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Debés confirmar la contraseña.')
    ).toBeInTheDocument();
  });

  test('muestra error si el nombre tiene menos de 3 caracteres', () => {
    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu nombre'), {
      target: { value: 'Al' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrarse' })
    );

    expect(
      screen.getByText('El nombre debe tener al menos 3 caracteres.')
    ).toBeInTheDocument();
  });

  test('muestra error si el correo no es válido', () => {
    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu correo'), {
      target: { value: 'correo-invalido' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrarse' })
    );

    expect(
      screen.getByText('Ingresá un correo electrónico válido.')
    ).toBeInTheDocument();
  });

  test('muestra error si la contraseña tiene menos de 8 caracteres', () => {
    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), {
      target: { value: '1234567' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrarse' })
    );

    expect(
      screen.getByText('La contraseña debe tener al menos 8 caracteres.')
    ).toBeInTheDocument();
  });

  test('muestra error si las contraseñas no coinciden', () => {
    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu nombre'), {
      target: { value: 'Ana Pérez' },
    });

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu correo'), {
      target: { value: 'ana@ejemplo.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), {
      target: { value: '12345678' },
    });

    fireEvent.change(screen.getByPlaceholderText('Repetí tu contraseña'), {
      target: { value: '87654321' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrarse' })
    );

    expect(
      screen.getByText('Las contraseñas no coinciden.')
    ).toBeInTheDocument();
  });

  test('registra al usuario y navega cuando los datos son válidos', () => {
    renderRegistro();

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu nombre'), {
      target: { value: 'Ana Pérez' },
    });

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu correo'), {
      target: { value: 'ana@ejemplo.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Ingresá tu contraseña'), {
      target: { value: '12345678' },
    });

    fireEvent.change(screen.getByPlaceholderText('Repetí tu contraseña'), {
      target: { value: '12345678' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: 'Registrarse' })
    );

    expect(setUsuario).toHaveBeenCalledWith({
      nombre: 'Ana Pérez',
      email: 'ana@ejemplo.com',
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
