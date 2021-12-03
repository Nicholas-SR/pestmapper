const SeverityBar = ({severityscore}) => {


    const severitystyle = {
        width: (severityscore === 1) | (severityscore === 2) ? "33%" : (severityscore === 3) | (severityscore === 4) ? "66%" : "100%",
        height: "100%",
        backgroundColor: (severityscore === 1) | (severityscore === 2) ? "#FFD527" : (severityscore === 3) | (severityscore === 4) ? "#FF7C33" : "#FF5E45" 
    }

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

}

export default SeverityBar;