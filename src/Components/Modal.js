import $ from 'jquery'

const Modal = ({ modalId, modalTitle, children, show = false, showModalState }) => {
    const closeModal = () => {
        showModalState(false);
        $('.modal-backdrop').hide();
    }
    return (
        <div
          id={modalId}
          className="modal"
          style={{ background: 'rgba(0,0,0,0.5)', display: show ? "block" : "none" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="myModalLabel">
                  {modalTitle}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                >
                  {" "}
                </button>
              </div>
              <div className="modal-body">
                <form>
                  {children}
                </form>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Modal;