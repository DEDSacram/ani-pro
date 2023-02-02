import { Component} from "solid-js";

export const Slider : Component = (props) => {
function onChange(e){
    props.PASSREF(e.target.value)
}
return(
    <input type="range" class="w-full" value={props.Initial} min="500" max="10000" step="500" oninput={onChange} ></input>
)
}