import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import './auth-premium.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [speechIndex, setSpeechIndex] = useState(0);
  const backgroundCanvasRef = useRef(null);
  const backgroundLayerRef = useRef(null);
  const robotStageRef = useRef(null);
  const formRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const lastEmail = localStorage.getItem('lastLoginEmail') || '';
  const currentHour = new Date().getHours();
  const periodGreeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  const normalizedIdentity = (username || lastEmail || '')
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim();
  const displayName = normalizedIdentity
    ? normalizedIdentity.charAt(0).toUpperCase() + normalizedIdentity.slice(1)
    : '';

  const progressLine = username && password
    ? 'Tudo pronto. Toque em Entrar agora.'
    : username
      ? 'Agora informe sua senha segura.'
      : lastEmail
        ? 'Use seu e-mail salvo para continuar.'
        : 'Digite seu e-mail para começar.';

  const robotMessages = [
    {
      title: displayName ? `Bem-vindo, ${displayName}.` : 'Bem-vindo.',
      lines: [
        `${periodGreeting}! Seu painel fiscal`,
        'está pronto com segurança.',
        progressLine,
      ],
    },
    {
      title: 'Sistema inteligente.',
      lines: [
        'Acompanhe dados, status e',
        'movimentações em tempo real',
        'em um único painel.',
      ],
    },
    {
      title: 'Decisão com confiança.',
      lines: [
        'Automações e visão clara para',
        'uma rotina fiscal produtiva',
        'com mais controle diário.',
      ],
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingSession(false);
      return;
    }

    api.get('/auth/me')
      .then(() => {
        window.location.href = '/dashboards';
      })
      .catch(() => {
        localStorage.removeItem('token');
        setCheckingSession(false);
      });
  }, []);

  useEffect(() => {
    let animationFrame;
    const canvas = backgroundCanvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const pointCount = 70;
    const points = Array.from({ length: pointCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }));

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
      ctx.fillRect(0, 0, width, height);

      points.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.65)';
        ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < points.length; j += 1) {
          const other = points[j];
          const dx = point.x - other.x;
          const dy = point.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.35 - distance / 350})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    let frame;
    const handleMouse = (event) => {
      if (!robotStageRef.current || !backgroundLayerRef.current) {
        return;
      }
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      const tiltX = Math.max(Math.min(-y * 8, 8), -8);
      const tiltY = Math.max(Math.min(x * 8, 8), -8);

      robotStageRef.current.style.setProperty('--robot-tiltX', `${tiltX}deg`);
      robotStageRef.current.style.setProperty('--robot-tiltY', `${tiltY}deg`);
      robotStageRef.current.style.transform = `translate(${x}px, ${y * -1}px)`;
      backgroundLayerRef.current.style.transform = `translate(${x * 0.25}px, ${y * 0.15}px)`;
    };

    const throttled = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => handleMouse(event));
    };

    window.addEventListener('pointermove', throttled);
    return () => {
      window.removeEventListener('pointermove', throttled);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!username && lastEmail) {
      setUsername(lastEmail);
    }
  }, [lastEmail, username]);

  useEffect(() => {
    const speechTimer = setInterval(() => {
      setSpeechIndex((prevIndex) => (prevIndex + 1) % robotMessages.length);
    }, 9000);

    return () => clearInterval(speechTimer);
  }, [robotMessages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = String(username || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    if (!normalizedEmail || !normalizedPassword) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }
    // Validação extra: e-mail válido
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setError('E-mail inválido.');
      return;
    }

    try {
      setError('');
      const res = await api.post('/auth/login', { email: normalizedEmail, password: normalizedPassword });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('lastLoginEmail', normalizedEmail);
      window.location.href = '/dashboards';
    } catch (err) {
      const apiError = err.response?.data?.error;
      if (err.response?.status === 400 && apiError) {
        setError(apiError);
        return;
      }
      if (err.response?.status === 401 && apiError) {
        setError('Usuário ou senha inválidos.');
        return;
      }
      setError(apiError || 'Erro ao logar');
    }
  };

  const handleRobotAction = () => {
    if (username && password) {
      formRef.current?.requestSubmit();
      return;
    }

    if (username && !password) {
      passwordInputRef.current?.focus();
      return;
    }

    if (!username && lastEmail) {
      setUsername(lastEmail);
      setTimeout(() => passwordInputRef.current?.focus(), 50);
      return;
    }

    usernameInputRef.current?.focus();
  };

  if (checkingSession) {
    return (
      <div className={`login-page${isLoaded ? ' loaded' : ''}`}>
        <div className="neural-grid" ref={backgroundLayerRef}>
          <canvas ref={backgroundCanvasRef} />
        </div>
        <div className="login-card">
          <div className="card-panel">
            <h2>Tokenizando o seu dia.</h2>
            <p className="panel-copy">Estamos preparando um acesso seguro. Aguarde um instante.</p>
          </div>
          <div className="card-form loading-state">
            <h1>Login</h1>
            <p className="subtitle">Validando sessão...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`login-page${isLoaded ? ' loaded' : ''}`}>
      <div className="neural-grid" ref={backgroundLayerRef}>
        <canvas ref={backgroundCanvasRef} />
      </div>
      <div className="login-card">
        <div className="card-panel robot-only">
          <div className="robot-stage" ref={robotStageRef} aria-hidden>
            <span className="robot-shadow" />
            <div className="robot-energy" />
            <div className="robot">
              <div className="robot-head">
                <div className="robot-ear left" />
                <div className="robot-ear right" />
                <div className="eye left" />
                <div className="eye right" />
                <div className="robot-mouth" />
              </div>
              <div className="robot-neck" />
              <div className="robot-body" />
              <div className="robot-arm left" />
              <div className="robot-arm right" />
            </div>
            <div className="robot-speech" key={speechIndex}>
              <strong>{robotMessages[speechIndex].title}</strong>
              <span className="robot-speech-line line-1">{robotMessages[speechIndex].lines[0]}</span>
              <span className="robot-speech-line line-2">{robotMessages[speechIndex].lines[1]}</span>
              <span className="robot-speech-line line-3">{robotMessages[speechIndex].lines[2]}</span>
              <button type="button" className="robot-action" onClick={handleRobotAction}>
                {username && password
                  ? 'Entrar agora'
                  : username
                    ? 'Preencher senha'
                    : lastEmail
                      ? 'Usar e-mail salvo'
                      : 'Começar agora'}
              </button>
            </div>
            <div className="notebook">
              <div className="notebook-cover" />
              <div className="notebook-screen" />
            </div>
            <div className="scanner-line" />
          </div>
        </div>
        <div className="card-form">
          <div className="form-head">
            <h1>Login</h1>
            <p className="subtitle">Use seu e-mail corporativo e senha segura para entrar.</p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="sr-only" htmlFor="username">E-mail</label>
              <input
                ref={usernameInputRef}
                id="username"
                type="text"
                placeholder="ti@empresa.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="icon" aria-hidden>👤</span>
            </div>
            <div className="form-field">
              <label className="sr-only" htmlFor="password">Senha</label>
              <input
                ref={passwordInputRef}
                id="password"
                type="password"
                placeholder="Senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon" aria-hidden>🔒</span>
            </div>
            <button type="submit">Entrar</button>
          </form>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-footer">
            <a href="/register">Criar conta</a>
            <span>·</span>
            <a href="/forgot-password">Esqueci minha senha</a>
          </div>
          <button type="button" className="micro-toggle">Modo IA ativado</button>
          <p className="subtitle-light">Acesso seguro ao painel — qualquer hora, qualquer lugar.</p>
        </div>
      </div>
    </div>
  );
}
