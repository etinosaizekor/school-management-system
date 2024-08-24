function LabelValuePair({ label, value }: { label: string; value: any }) {
  return (
    <span className="flex">
      <div className="w-32">
        <h6>{`${label}: `}</h6>
      </div>
      <span className="flex-1">
        <p>{value}</p>
      </span>
    </span>
  );
}

export default LabelValuePair;
