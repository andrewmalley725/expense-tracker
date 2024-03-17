export default function Modal({ func, show }){
    return(
      show ? <div className="modal">
        <div className="ovelay"></div>
        <div className='modal-content'>
          {func}
        </div>
      </div> : <></>
    )
  }