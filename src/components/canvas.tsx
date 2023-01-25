export default function Canvas(props:any) : any {
  if(props.overlay == true){
    return <canvas class="absolute bg-transparent z-20 opacity-80" ref={props.ref} width={props.width} height={props.height}/>;
  }
  else{
    return <canvas class="absolute bg-transparent z-30" ref={props.ref} width={props.width} height={props.height}/>;
  }
  
}
