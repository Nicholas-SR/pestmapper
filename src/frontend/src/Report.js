import moment from 'moment'
import SeverityBar from './SeverityBar';


const Report = ({reportdata}) => {
    return ( 
        <div className="report">
            <div className="logonamedate">

                <img
                    src={'/invlogo.svg'}
                    width="10%"
                />

                <div className="namedate">
                    {moment(reportdata.date).format('MMMM d, YYYY')}<br/>
                    <div className="name">{reportdata.name}</div>
                </div>

            </div>
            
            <div className="linebreak"><div className="line"></div></div>
            
            <div className="reportinfo"> 

                <div className="infestationtype">
                    <span className="subtitle">Type:{' '}</span>
                    
                    <span className="bugtype">
                    {reportdata.bug !== 'BOTH'
                    ? reportdata.bug === 'BEDBUG'
                        ? 'BEDBUGS'
                        : 'COCKROACHES'
                    : 'BEDBUGS & COCKROACHES'}
                    </span>
                </div>

                <div className="reportseverity">
                <span className="subtitle">Severity: </span>

                    <SeverityBar severityscore={reportdata.score}></SeverityBar>
                </div>

                <div className="reportcomment">

                    <div className="reportcommentwrapper">
                        {reportdata.comment}
                    </div>
                </div>

                    
            </div>
            
        </div> );
}
 
export default Report;