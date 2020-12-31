//ui functions
input_screen=document.getElementById("input_screen")
show_hide_button=document.getElementById("show_hide_input_screen_button")
validate_input=document.getElementById("validate_input")
functions=document.getElementById("functions")

visible_input=false
function show_hide_input_screen(){
if(visible_input){
    visible_input=false
    /*show_hide_button.style.width="100px"*/
    show_hide_button.innerHTML="Edit inputs"
    show_hide_button.style.backgroundColor="#0000af"
    input_screen.style.opacity=0
    validate_input.style.opacity=0
    /*functions.style.opacity=0*/
}else{
    /*functions.style.opacity=1*/
    input_screen.style.opacity=1
    validate_input.style.opacity=1
    visible_input=true
    /*show_hide_button.style.width="40px"*/
    show_hide_button.innerHTML="Close"
    show_hide_button.style.backgroundColor="red"
}
    
}

function fill_table_form(activities_array){
for(var i=0;i<activities_array.length;i++){
    document.getElementById("table").innerHTML += `<tr class="row" id="task_row`+i+`">
                
<td><input id="description" type="text" onchange="update_input(this)" value="" ></td>
<td><input id="code"        type="text" onchange="update_input(this)" value="`+activities_array[i].id+`" ></td>
<td><input id="depends_on"  type="text" onchange="update_input(this)" value="`+activities_array[i].depends_on+`" ></td>
<td><input id="op"          type="text" onchange="update_input(this)" value="" ></td>
<td><input id="ml"          type="text" onchange="update_input(this)" value="" ></td>
<td><input id="ps"          type="text" onchange="update_input(this)" value="" ></td>
            </tr>`
}
    }

function update_input(input_obj){
    console.log(input_obj.value)
    
    
}





























activities2=[
    {id:"A",
    depends_on:[]
    },{id:"B",
    depends_on:[]
    },{id:"H",
    depends_on:[]
    },{id:"E",
    depends_on:["A"]
    },{id:"x0",
    depends_on:["B"]
    },{id:"x1",
    depends_on:["H"]
    },{id:"C",
    depends_on:["E","x0","x1"]
    },{id:"F",
    depends_on:["E","x0","x1"]
    },{id:"D",
    depends_on:["C"]
    },{id:"x2",
    depends_on:["F"]
    },{id:"G",
    depends_on:["D","x2"]
    }]
activities0=[
    {id:"A",
    depends_on:[]
    },{id:"B",
    depends_on:[]
    },{id:"C",
    depends_on:["E","B","H"]
    },{id:"D",
    depends_on:["C"]
    },{id:"E",
    depends_on:["A"]
    },{id:"F",
    depends_on:["E","B","H"]
    },{id:"G",
    depends_on:["D","F"]
    },{id:"H",
    depends_on:[]
    }]


function add_level_attribute_to_tasks(task_id){
    var n=0 
    //first non depandant tasks on level 0
    for(var i=0;i<activities.length;i++){
    if(activities[i].depends_on.length==0){
        get_task_object_by_id(activities[i].id)["level"]=0
        get_task_object_by_id(activities[i].id)["depends_on"]=activities[i].depends_on
        activities_by_level[0].push(activities[i].id)
    }}
    var lvl=0
    //second tasks that are only depandant on previus tasks
    for(var j=0;j<activities_by_level.length;j++){
        lvl++
    for(var i=0;i<activities.length;i++){
        //if a task depends sololy on a task or more from the level before
     if(!(intersect(activities[i].depends_on,activities_by_level[j]).length==0) &&
        (difference(activities[i].depends_on,activities_by_level[j]).length==0)){
        get_task_object_by_id(activities[i].id)["level"]=lvl
         get_task_object_by_id(activities[i].id)["depends_on"]=activities[i].depends_on
        activities_by_level.push([])
        activities_by_level[lvl].push(activities[i].id)
         j=0
         console.log((intersect(activities[i].depends_on,activities_by_level[j]))+" havs a task depending on it on level "+lvl)
         build_tasks()
         //if task depends on tasks including a task or more that are not from the level before
         
    }else if(!(intersect(activities[i].depends_on,activities_by_level[j]).length==0) &&
            !(difference(activities[i].depends_on,activities_by_level[j]).length==0)){
   console.log(activities[i].depends_on)
        
        console.log((intersect(activities[i].depends_on,activities_by_level[j]))+" doesnt have a task depending on it on level "+lvl)
        //create dummy task for it
        
        
      for(var k=0;k<(intersect(activities_copy[i].depends_on,activities_by_level[j])).length;k++){
        replace((intersect(activities_copy[i].depends_on,activities_by_level[j])[k]),("X"+k),activities[i].depends_on)
          activities.push(
               {id:("X"+k), 
    depends_on:[intersect(activities_copy[i].depends_on,activities_by_level[j])[k]]
    }
            )
          
          
      }
        
        
        
 
    
      
        }
        }
        
        }
        }



//if an activity depends on activities which include an activity that starts from
function there_is_dummy_task_between_(task_id1,task_id2){
    //start with level 0 tasks

}
function generate_dummy_tasks(){    
    //must know if there is a dummy activity between a task and a task depending on it
    /*to generate dummy tasks we must edit the activities array*/
    
    /* loop through zall tasks each task has a task before and a task afeter
    it should also have a level of task before and a level of the task after
    
    */
    
    /*
    0) put all activites that doesnt depend on any activites first
    */

    /*
    1) if certain activity doesnt have any task that depends on it then create a dummy task Xi that depends on it
    example:
    activity B doesnt have another activity that depends on it
    {id:"x0",
    depends_on:["B"]}*/
        
    /*2) if a non dummy task depends on tasks that has a dummy task that depends on them, then replace these task with the dummy tasks that depends on them
    example: 
    {id:"x0",
    depends_on:["B"]
    },{id:"x1",
    depends_on:["H"] 
    },{id:"F", 
    depends_on:["E","B","H"]} <----------------------before
    activity F becomes:
    {id:"F", 
    depends_on:["E","x0","x1"]}  <-------------------after

    3) put all activities that doent depend on previus activities first
    
    4) put activities that depend on the previus activites and so on*/
    
}


