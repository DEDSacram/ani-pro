import { Component } from "solid-js";
import { createSignal } from "solid-js";
import "../dropdown.css"
import {  FiChevronDown, FiChevronUp} from "solid-icons/fi";
export const DropdownCipher : Component = () => {
const [open, setOpen] = createSignal(false);
const [cipher, setCipher] = createSignal("Select Cipher");

function myFunction() {
    setOpen(!open())
    document.getElementById("myDropdown").classList.toggle("show");
  }

function onChange(e){
 
    setCipher(e.target.textContent)
}
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
return(
<div class="dropdown w-full">
  {/* <button onClick={myFunction} class="dropbtn w-full">{cipher()}</button> */}
  {/* <button onClick={myFunction} class="flex  items-center justify-between text-center dropbtn w-full p-2 rounded text-sm ">
  {cipher()}
  {open() ? <FiChevronUp color="white" class=" dropbtn"/>:  <FiChevronDown color="white" class=" dropbtn"/>}
</button> */}
  <button onClick={myFunction} class="flex  text-center dropbtn w-full p-2 rounded text-sm ">
  {cipher()}
</button>
  <div id="myDropdown" class="dropdown-content w-full text-center">
    <a onClick={onChange}>Caesar</a>
    <a onClick={onChange}>Playfair</a>
  </div>
</div>
)

}