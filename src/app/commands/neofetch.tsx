import BrowserArt from '../components/BrowserArt';

const neofetch = () => {
  return (
    <div>
      <BrowserArt />
      <div className="mt-4">
        <p>🎨 Welcome to my portfolio terminal! Type 'help' for available commands.</p>
      </div>
    </div>
  );
};

export default neofetch;