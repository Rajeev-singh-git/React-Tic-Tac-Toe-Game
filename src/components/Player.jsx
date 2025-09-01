export default function Player({ name, symbol }) {
  return (
    <li>
      <span className="player">
        <span className="player-name">{name}</span>
        <span classSymobol="player-name">{symbol}</span>
      </span>
      <button>Edit</button>
    </li>
  );
}
