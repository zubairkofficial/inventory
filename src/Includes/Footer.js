import Helpers from "../Config/Helpers";

function Footer(){
    return (
        <footer className="footer" style={{ left: 275 }}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">© { Helpers.appName }.</div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  All Rights Reserved
                </div>
              </div>
            </div>
          </div>
        </footer>
    );
}

export default Footer;