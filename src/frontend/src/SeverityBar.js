const SeverityBar = ({ severityscore }) => {
  const severitystyle = {
    width:
      (severityscore === 1) ? "33%" : (severityscore === 2) ? "66%" : "100%",
    height: "100%",
    backgroundColor:
      (severityscore === 1) ? "#fae319" : (severityscore === 2) ? "#fac619" : "#fa9819",
  };

  return (
    <div className="sev">
      <div className="severitybar">
        <div className="severity" style={severitystyle}></div>
      </div>

      <div className="mildseverity"></div>
      <div className="moderateseverity"></div>
      <div className="severeseverity"></div>
    </div>
  );
};

export default SeverityBar;
