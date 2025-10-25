interface InfoHintProps {
  message: string;
}

const InfoHint = ({ message }: InfoHintProps) => (
  <span
    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 bg-slate-200 text-xs font-bold text-slate-700 transition-colors duration-150 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
    role="img"
    aria-label="info"
    title={message}
  >
    ?
  </span>
);

export default InfoHint;
