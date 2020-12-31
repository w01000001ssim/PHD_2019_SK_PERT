task_codes=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
canv = document.getElementById("canv")
ctx= canv.getContext("2d")
ctx.beginPath()
canv.width = window.innerWidth;
canv.height = window.innerHeight;
h=canv.height
w=canv.width


 number =     ""
 description =""
 code =       ""
 depends_on = ""
 op =         ""
 ml =         ""
 ps =         ""
nodes=[]
j_nodes=[]
nodes_by_level=[]
node_coordinates=[]
organized_nodes=[]
level_tasks=[]
tasks=[]
dummy_tasks_from_acts=[]
far_relations_array=[]
same_level_relations_array=[]
dummy_task_counter=0


x_distance_between_nodes=100
y_distance_between_nodes=100

margin_x=(x_distance_between_nodes)
margin_y=(y_distance_between_nodes)

task_text_font_size=15
node_text_font_size=15

node_radius=25 
ring_radius=node_radius+1.5

ring_color="#000"
node_color="#fff"
line_color="#000"
dashed_line_color="#000"
node_text_color="#000"
task_text_color="#fff"

task_text_shadow_color="#000"
node_text_shadow_color="#000"
line_shadow_color="#000"
ring_shadow_color="#000"


line_shadowBlur=0
ring_shadowBlur=0
task_shadowBlur=8
node_shadowBlur=0

//number of times to re draw shadow
task_shadow_visibility=3
node_shadow_visibility=5


line_width=2
dashed_line_width=2
line_dash=[10,3]//10px line 3px space
node_ring_width=2



node_ring=true
draw_task_ids_on_lines=true
draw_dummy_task_ids_on_lines=false

activities_fill=[
  {
    "id": "A",
    "depends_on": [],
    "activity_level": 0
  },
  {
    "id": "C",
    "depends_on": [
      "A"
    ],
    "activity_level": 1
  },
  {
    "id": "D",
    "depends_on": [
      "A"
    ],
    "activity_level": 1
  },
  {
    "id": "E",
    "depends_on": [
      "A"
    ],
    "activity_level": 1
  },
  {
    "id": "F",
    "depends_on": [
      "A"
    ],
    "activity_level": 1
  },
  {
    "id": "G",
    "depends_on": [
      "D"
    ],
    "activity_level": 2
  },
  {
    "id": "H",
    "depends_on": [
      "D"
    ],
    "activity_level": 2
  },
  {
    "id": "I",
    "depends_on": [
      "C"
    ],
    "activity_level": 2
  },
  {
    "id": "J",
    "depends_on": [
      "D",
      "E"
    ],
    "activity_level": 2
  },
  {
    "id": "L",
    "depends_on": [
      "C",
      "E"
    ],
    "activity_level": 2
  },
  {
    "id": "K",
    "depends_on": [
      "I",
      "D"
    ],
    "activity_level": 3
  },
  {
    "id": "N",
    "depends_on": [
      "F",
      "D",
      "H"
    ],
    "activity_level": 3
  },
  {
    "id": "O",
    "depends_on": [
      "E",
      "I",
      "D"
    ],
    "activity_level": 3
  },
  {
    "id": "Q",
    "depends_on": [
      "H",
      "A",
      "J"
    ],
    "activity_level": 3
  },
  {
    "id": "M",
    "depends_on": [
      "G",
      "K"
    ],
    "activity_level": 4
  },
  {
    "id": "P",
    "depends_on": [
      "K",
      "H",
      "C"
    ],
    "activity_level": 4
  },
  {
    "id": "R",
    "depends_on": [
      "O",
      "L",
      "G",
      "J"
    ],
    "activity_level": 4
  },
  {
    "id": "S",
    "depends_on": [
      "M",
      "P",
      "R"
    ],
    "activity_level": 5
  }
]
           
       
/*mark_non_dummy_tasks()
function mark_non_dummy_tasks(){
    for(var l=0;l<activities.length;l++){ 
activities[l]["is_dummy_task"]=false
    }
}*/

  //  build_nodes()
draw_grid()


//AoA first test functions:
//------------------------------------------------------------------------------------------------------
//builds array of objects as nodes[] each node is defined by the tasks before it and the tasks after
function build_nodes(){
    clear_canvas()
    create_dummy_tasks()
for(var l=0;l<activities.length;l++){ 
    var tasks_before=[]
    
    
    var tasks_after=get_tasks_after(activities[l].id)
        
    if(!tasks_after.length==0){
    for(var i=0;i<tasks_after.length;i++){
            
   tasks_before =(get_tasks_before(tasks_after[i]))
   
        
        if(!j_nodes.includes(JSON.stringify({node_id:"",tasks_before:tasks_before,tasks_after:tasks_after}))){
        j_nodes.push(JSON.stringify({node_id:"",tasks_before:tasks_before,tasks_after:tasks_after}))
       } 
        }}
   
 
    
    }
    for(var k=0;k<j_nodes.length;k++){
        nodes.push(JSON.parse(j_nodes[k]))
    }
       //add first node
    nodes.unshift({node_id:0,tasks_before:[],tasks_after:get_first_tasks()})
    //add last node
    nodes.push({node_id:0,tasks_before:get_last_tasks(),tasks_after:[]})
    
for(var i=0;i<nodes.length;i++){
    nodes[i].node_id=i+1
    
}
build_tasks()
}
//builds array of objects as tasks[] each task is defined by it's ID, the node before and the node after
function build_tasks(){
    
    
    activities_backup=[].concat(activities)
level=0
c=0
for(var i=0;i<activities.length;i++){
        if(activities[i].depends_on.length==0){
        level_tasks.push({
        id:activities[i].id, 
            task_level:activities[i].activity_level,
        is_dummy_task:activities[i].is_dummy_task,
        depends_on:activities[i].depends_on,
        from_node:get_starting_node_id_of_task(activities[i].id),
        to_node:get_ending_node_id_of_task(activities[i].id)})
        c++
        index = activities.indexOf(activities[i]);
    if (index > -1) {activities.splice(index, 1);i--}}}
    
    tasks.push(level_tasks)
    level_tasks=[]
    c=0
while (activities.length>0){
for(var l=0;l<tasks[level].length;l++){
for(var i=0;i<activities.length;i++){
    if(activities[i].depends_on.includes(tasks[level][l].id) &&
      ((tasks[level][l].task_level)+1 == activities[i].activity_level)
      ){ 
        ////console.log("activities[i]")
        ////console.log(activities[i])
        //
        ////console.log("tasks[level][l]")
        ////console.log(tasks[level][l])
        
        
        level_tasks.push({
        id:activities[i].id,
            task_level:activities[i].activity_level,
        is_dummy_task:activities[i].is_dummy_task,
        depends_on:activities[i].depends_on,
        from_node:get_starting_node_id_of_task(activities[i].id),
        to_node:get_ending_node_id_of_task(activities[i].id)})
        c++
        index = activities.indexOf(activities[i]);
    if (index > -1) {activities.splice(index, 1);i--}}}}
    if(level_tasks.length>0){
    tasks.push(level_tasks)}
    level_tasks=[]
    c=0
    level++
}
   activities=activities_backup
    
    
    
   build_nodes_by_level()
   draw_all_nodes()
} 
//builds array of arrays,each array is a node level, each sub array contains IDs of nodes of that level
function build_nodes_by_level(){
    for(var lvl=1;lvl<number_of_levels();lvl++){
        
    nodes_by_level.push(nodes_on_level(lvl))
    }
    //nodes_by_level.unshift([nodes[0].node_id])
    //nodes_by_level.push([nodes[nodes.length-1].node_id])
}
function get_max_nodes_on_levels(){
    var max_length=0
for(var L=0;L<nodes_by_level.length;L++){
 if(nodes_by_level[L].length>max_length){
     max_length=nodes_by_level[L].length
 }
}
    return max_length
}

function get_max_aon_on_levels(){
    var max_length=0
    var aon_by_level=build_aon_by_level()
for(var L=0;L<aon_by_level.length;L++){
 if(aon_by_level[L].length>max_length){
     max_length=aon_by_level[L].length
 }
}
    return max_length
}
function draw_line(node1_id,node2_id,task_id){
    ////console.log("node2_id")
    ////console.log(node2_id)
    ctx.setLineDash([])
ctx.shadowColor=line_shadow_color;
ctx.shadowBlur=line_shadowBlur;
    var x1 =nodes.find(n => n.node_id == node1_id).x
    var y1 =nodes.find(n => n.node_id == node1_id).y
    var x2 =nodes.find(n => n.node_id == node2_id).x
    var y2 =nodes.find(n => n.node_id == node2_id).y
      ctx.strokeStyle=line_color
    ctx.lineWidth = line_width;
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()
    
    if(draw_task_ids_on_lines){
       for(var i=0;i<task_shadow_visibility;i++){
ctx.shadowColor=task_text_shadow_color;
ctx.shadowBlur=task_shadowBlur;
ctx.font = 'bold '+task_text_font_size+'px sans-serif';
ctx.fillStyle=task_text_color
ctx.textAlign="center"
ctx.textBaseline="middle"    
ctx.fillText(task_id, (x1+x2)/2, (y1+y2)/2); 
        
        
       }}
    
    
}
 
function draw_line_between(task1_id,task2_id){
    ////console.log("node2_id")
    ////console.log(node2_id)
    ctx.setLineDash([])
ctx.shadowColor=line_shadow_color;
ctx.shadowBlur=line_shadowBlur;
    var x1 =aon_nodes.find(n => n.task_id == task1_id).x
    var y1 =aon_nodes.find(n => n.task_id == task1_id).y
    var x2 =aon_nodes.find(n => n.task_id == task2_id).x
    var y2 =aon_nodes.find(n => n.task_id == task2_id).y
      ctx.strokeStyle=line_color
    ctx.lineWidth = line_width;
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()
    
    get_arow_head_coordinates(x1,y1,x2,y2)
    
    //draw arrow at the end node task1_id
    //calculate the coordinates of the point where the arrow reaches the cercumference of the spheres
    
    //    (x1,y1)-----------------m--------------------(X,Y)---n---(x2,y2)
    //    (X,Y) ===> X= (mx2 + nx1)/(m+n)   ,  Y= (my2 + ny1)/(m+n)
    
    //then draw and arrow
    
    
/*    if(draw_task_ids_on_lines){
       for(var i=0;i<task_shadow_visibility;i++){
ctx.shadowColor=task_text_shadow_color;
ctx.shadowBlur=task_shadowBlur;
ctx.font = 'bold '+task_text_font_size+'px sans-serif';
ctx.fillStyle=task_text_color
ctx.textAlign="center"
ctx.textBaseline="middle"    
ctx.fillText(task_id, (x1+x2)/2, (y1+y2)/2); 
        
        
       }}*/
    
    
}
    function get_arow_length(x1,y1,x2,y2){
        
        return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
        
    }
    
    
    function get_arow_head_coordinates(x1,y1,x2,y2){
        var d = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
        var n = d - node_radius-2
        var m = d - n
        var X =(m*x2 + n*x1)/(m+n)
        var Y =(m*y2 + n*y1)/(m+n)
        
        ctx.beginPath()
    ctx.moveTo(X,Y)
        ctx.arc(X,Y,4,0,2*Math.PI)
        //ctx.fillStyle = "#fff"
        
ctx.fill()
    }
    
    
    
    
    
    
//------------------------------------------------------------------------------------------------------
//draw a node at coordinates x,y lable as node_id
function draw_node(x,y,nodeID){
   ctx.setLineDash([])
    ctx.shadowColor=0
ctx.shadowBlur=0
    
    ctx.strokeStyle=ring_color
    ctx.fillStyle=node_color
    
    ctx.moveTo(x,y)
    ctx.beginPath()
    ctx.arc(x,y,node_radius,0,2*Math.PI)
    ctx.fill()
    
     if(node_ring){
        ctx.shadowColor=ring_shadow_color;
ctx.shadowBlur=ring_shadowBlur;
    ctx.lineWidth=node_ring_width    
    ctx.moveTo(x,y)
    ctx.beginPath()
    ctx.arc(x,y,ring_radius,0,2*Math.PI)
    ctx.stroke()
    }
    
ctx.shadowColor=node_text_shadow_color;
ctx.shadowBlur=node_shadowBlur;
    
    ctx.font = 'bold '+node_text_font_size+'px sans-serif';
    ctx.fillStyle=node_text_color
    ctx.textAlign="center"
ctx.textBaseline="middle"  
    for(var i=0;i<node_shadow_visibility;i++){
    ctx.fillText(nodeID.toString(), x, y+2); 
    }
   
}
//draw a line connecting 2 nodes given two node IDs
//draw a dashed line connecting 2 nodes given two node IDs
function draw_dashed_line(node1_id,node2_id,task_id){
    //console.log("node1_id")
    //console.log(node1_id)
    //console.log("node2_id")
    //console.log(node2_id)
    
    ctx.setLineDash(line_dash)
ctx.shadowColor=line_shadow_color;
ctx.shadowBlur=line_shadowBlur;
    var x1 =nodes.find(n => n.node_id == node1_id).x
    var y1 =nodes.find(n => n.node_id == node1_id).y
    var x2 =nodes.find(n => n.node_id == node2_id).x
    var y2 =nodes.find(n => n.node_id == node2_id).y
      ctx.strokeStyle=line_color
    ctx.lineWidth = line_width;
    ctx.beginPath()
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()
    
    if(draw_dummy_task_ids_on_lines){
       
ctx.shadowColor=task_text_shadow_color;
ctx.shadowBlur=task_shadowBlur;
ctx.font = 'bold '+task_text_font_size+'px sans-serif';
ctx.fillStyle=task_text_color
ctx.textAlign="center"
ctx.textBaseline="middle"    
ctx.fillText(task_id, (x1+x2)/2, (y1+y2)/2); 
        
        
       }
    
}
//returns length of the level which has the most nods
//draws all nodes as a grid each vertical set of nodes represents a level
function draw_all_nodes(){
    var max_number_of_nodes=get_max_nodes_on_levels()
    
    
   //nc=0
    //set coordinates for all nodes
for(var L=0;L<nodes_by_level.length;L++){
    var number_of_nodes_on_this_level= nodes_by_level[L].length
    
    //uncomment this to center nodes based on screen height
    var total_offset=0 /*(h-(y_distance_between_nodes*max_number_of_nodes))/2*/
    var level_offset=0
    level_offset= ((y_distance_between_nodes * max_number_of_nodes)/2) -
                  ((y_distance_between_nodes * number_of_nodes_on_this_level)/2)
for(var N=0;N<nodes_by_level[L].length;N++){

    
    
    nodes.find(n => n.node_id == [nodes_by_level[L][N]])["x"]=margin_x+x_distance_between_nodes*L
    nodes.find(n => n.node_id == [nodes_by_level[L][N]])["y"]=margin_y+level_offset+total_offset+y_distance_between_nodes*N 
   
}}
    
    draw_all_lines()
    
    draw_far_dummy_tasks()
    //draw_same_level_dummy_tasks()
    
    for(var L=0;L<nodes_by_level.length;L++){
            var level_offset=0
    var number_of_nodes_on_this_level= nodes_by_level[L].length
    level_offset= ((y_distance_between_nodes * max_number_of_nodes)/2) -
                  ((y_distance_between_nodes * number_of_nodes_on_this_level)/2)
for(var N=0;N<nodes_by_level[L].length;N++){
draw_node(margin_x+x_distance_between_nodes*L,margin_y+level_offset+total_offset+y_distance_between_nodes*N,nodes_by_level[L][N])

}}
    

}
function draw_far_dummy_tasks(){
    for(var frl=0;frl<far_relations_array.length;frl++){
    
     create_far_dummy_task_between(far_relations_array[frl][0],far_relations_array[frl][1])}
   
    sort_activities()
}

function draw_same_level_dummy_tasks(){
        for(var frl=0;frl<same_level_relations_array.length;frl++){
    
     create_same_level_dummy_task_between(same_level_relations_array[frl][0],same_level_relations_array[frl][1])}
   
    sort_activities()
}

//draws lines by loops through tasks and connecting the starting node with the ending node
function draw_all_lines(){
for(var L=0;L<tasks.length;L++){
for(var T=0;T<tasks[L].length;T++){
    ////console.log("tasks["+L+"]["+T+"].id")
    ////console.log(tasks[L][T].id)
    if(tasks[L][T].is_dummy_task){
       
       draw_dashed_line(tasks[L][T].from_node,tasks[L][T].to_node,tasks[L][T].id) 
       }else{
       
           ////console.log("tasks["+L+"]["+T+"].to_node")
           ////console.log(tasks[L][T].to_node)
        draw_line(tasks[L][T].from_node,tasks[L][T].to_node,tasks[L][T].id)  
       }
    
}}}
//------------------------------------------------------------------------------------------------------
//returns array of strings of tasks that doesnt depend on other tasks 
function get_first_tasks(){
    var first_tasks=[]
    for(var i=0;i<activities.length;i++){
       if(activities[i].depends_on.length==0){
           first_tasks.push(activities[i].id)
       }
    }
    return first_tasks
}
//returns array of strings of tasks that doesnt have other tasks depending on them
function get_last_tasks(){
    /*var last_tasks=[]
    for(var i=0;i<activities.length;i++){
    //console.log("get_tasks_after(activities[i].id).length==0")
    //console.log(get_tasks_after(activities[i].id).length==0)
    //console.log("(get_level_of(activities[i].id) == tasks.length-1)")
    //console.log(get_tasks_after(activities[i].id).length==0)
    //console.log("(get_level_of(activities[i].id) == tasks.length-2)")
    //console.log((get_level_of(activities[i].id) == tasks.length-2))
        
       if(get_tasks_after(activities[i].id).length==0 && (get_level_of(activities[i].id) == tasks.length-1)){
           last_tasks.push(activities[i].id)
       }else if(get_tasks_after(activities[i].id).length==0 && (get_level_of(activities[i].id) < tasks.length-1)){
           //create a dummy task between last task and end node
           //console.log({id:("X"+dummy_task_counter), depends_on:[activities[i].id],is_dummy_task:true})
        activities.unshift({id:("X"+dummy_task_counter), depends_on:[activities[i].id],is_dummy_task:true})
           last_tasks.push("X"+dummy_task_counter)
            dummy_task_counter++
       }
    }*/
    
    var last_tasks=[]
    for(var i=0;i<activities.length;i++){
    
       if(get_tasks_after(activities[i].id).length==0 /*&& (get_level_of(activities[i].id) == tasks.length-1)*/){
           last_tasks.push(activities[i].id)
       }else /*if(get_tasks_after(activities[i].id).length==0)*/{ 
       }
    }
          // //console.log(last_tasks)
    return last_tasks
} 
//------------------------------------------------------------------------------------------------------
//returns array of strings as tasks after a given task_id
function get_tasks_after(task_id){
    //tasks that are right after excluding twi levels higher
     tasks_af=[]
     for(var i=0;i<activities.length;i++){
       if(activities[i].depends_on.includes(task_id) && (get_level_of(task_id)+1 == get_level_of(activities[i].id)) ){
          tasks_af.push(activities[i].id)
          }}return tasks_af}  
//returns array of strings as tasks before a given task_id
function get_tasks_before(task_id){
    tasks_bf=[]
      
           
     for(var i=0;i<get_activities_object_by_id(task_id).depends_on.length;i++){
       
           
       if((get_level_of(task_id)-1) == (get_level_of(get_activities_object_by_id(task_id).depends_on[i]))){
           tasks_bf.push(get_activities_object_by_id(task_id).depends_on[i])
           
          
       }
       }
           return tasks_bf
       
          
       }
// returns starting node_id of a given task
function get_starting_node_id_of_task(task){
        for(var i=0;i<nodes.length;i++){
            if (nodes[i].tasks_after.includes(task)){
                return nodes[i].node_id
            }
        } 
    }
// returns ending node_id of a given task
function get_ending_node_id_of_task(task){
        for(var i=0;i<nodes.length;i++){
            if (nodes[i].tasks_before.includes(task)){
                return nodes[i].node_id
            }
        }
    return nodes[nodes.length-1].node_id
    }
//------------------------------------------------------------------------------------------------------
//returns array of IDs of selected level
function nodes_on_level(level){
    level--
    var level_tasks=tasks[level]
    var next_nodes=[]
for(var i=0;i<level_tasks.length;i++){
    if(!next_nodes.includes(level_tasks[i].to_node) && !next_nodes.includes(nodes[nodes.length-1].node_id)){
       
next_nodes.push(level_tasks[i].to_node)
       }else if(next_nodes.includes(nodes[nodes.length-1].node_id)){
           return next_nodes
       }


}
    return next_nodes
}
//returns array of strings of task IDs on selected level
function ids_of_tasks_on_levels(level){
    level--
    var tasks_of_level=[]
    for(var i=0;i<tasks[level].length;i++){
    tasks_of_level.push(tasks[level][i].id)
}
    return tasks_of_level
    
}
//------------------------------------------------------------------------------------------------------
//returns number of tasks on selected level
function number_of_tasks_on_level(level){
    return tasks[level-1].length
}
//returns number of levels tasks.length
function number_of_levels(){
    return tasks.length
}
//------------------------------------------------------------------------------------------------------
//returnes an array of the common elements between two arrays
function intersect(array1,array2){
  return  array1.filter(value => array2.includes(value))
}
//return an a array of the different elements between two arrays
function difference(arr1,arr2){
  return arr1.filter(x => !arr2.includes(x));
}
//replaces a with b in array
function replace(a,b,array){
  array[array.indexOf(a)] = b;
}
//------------------------------------------------------------------------------------------------------
 //returns a task object given it's id
function get_task_object_by_id(task_id){
    var task_object  
    for(var i=0;i<tasks.length;i++){
    if(!(tasks[i].find(x => x.id === task_id) == undefined)){
        
    task_object = tasks[i].find(x => x.id === task_id)
    }
}
    return task_object
}
//returns an activities object given it's id
function get_activities_object_by_id(task_id){
    var activities_object  
    for(var i=0;i<activities.length;i++){
    if(!(activities.find(x => x.id === task_id) == undefined)){
        
    activities_object = activities.find(x => x.id === task_id)
    }
}
    return activities_object
}
//returns an array of dummy tasks from activities
function get_dummy_tasks_from_activities(){
    var dummy_tasks_from_activities =[]
    for(var i=0;i<activities.length;i++){
        if(activities[i].is_dummy_task){
           dummy_tasks_from_activities.push(activities[i])
           }
    }
    return dummy_tasks_from_activities
}
//------------------------------------------------------------------------------------------------------
//sees if a task has a dummy task and returns object of the dummy task if true, else returns false
function has_a_dummy_task(task){
     dummy_tasks_from_acts=get_dummy_tasks_from_activities()
    
    for(var i=0;i<dummy_tasks_from_acts.length;i++){
        if(dummy_tasks_from_acts[i].depends_on.includes(task)){
            return dummy_tasks_from_acts[i]
        }
    }
    return false
}

function create_last_dummy_task_for(task_id){
    
    
    if(!has_a_dummy_task(task_id)){ 
            //console.log("get_activities_object_by_id(task_id).id") 
            //console.log(get_activities_object_by_id(task_id).id) 
        
        get_activities_object_by_id(task_id).id="X"+dummy_task_counter
            //console.log("after get_activities_object_by_id(task_id).id") 
            //console.log(get_activities_object_by_id(task_id).id) 
            
            activities.unshift({id:("X"+dummy_task_counter), depends_on:[task_id],is_dummy_task:true})
            dummy_task_counter++
        }else{
            ////console.log("Task "+task1_id+" has_a_dummy_task") 
            //replace(task1_id,(has_a_dummy_task(task1_id).id),get_activities_object_by_id(task2_id).depends_on)
        }
    
    
    
    
}

function draw_same_level_dummy_tasks(task1_id,task2_id){
    var starting_node={}
    var ending_node={}
    //find startning node where tasks before includes task1 id
    //find ending node where tasks after includes task2 id

    for(var i=0;i<nodes.length;i++){
      
        
        if(nodes[i].tasks_after.includes(task1_id)){
            starting_node = nodes[i]
        }else if(nodes[i].tasks_before.includes(task2_id)){
            ending_node = nodes[i]
                 }
        
    }
    

    draw_dashed_line(starting_node.node_id,ending_node.node_id,"X"+dummy_task_counter)
    dummy_task_counter++
}
function create_far_dummy_task_between(task1_id,task2_id){
    var starting_node={}
    var ending_node={}
    //find startning node where tasks before includes task1 id
    //find ending node where tasks after includes task2 id
        //console.log("nodes")
        //console.log(nodes)
    for(var i=0;i<nodes.length;i++){
        //console.log("nodes[i].tasks_before.includes(task1_id)")
        //console.log(nodes[i].tasks_before.includes(task1_id))
        //console.log("nodes[i].tasks_before.includes(task2_id)")
        //console.log(nodes[i].tasks_before.includes(task2_id))
        
        
        if(nodes[i].tasks_after.includes(task1_id)){
            starting_node = nodes[i]
        }else if(nodes[i].tasks_before.includes(task2_id)){
            ending_node = nodes[i]
                 }
        
    }
    
    //console.log("starting_node")
    //console.log(starting_node)
    //console.log("ending_node")
    //console.log(ending_node)
    draw_dashed_line(starting_node.node_id,ending_node.node_id,"X"+dummy_task_counter)
    dummy_task_counter++
}
//creates a dummy task between two selected tasks
function create_dummy_task_between(task1_id,task2_id){
    
    
    if(!((task1_id == "last" ) || (task2_id == "last" ))){
    if(get_activities_object_by_id(task2_id).depends_on.includes(task1_id)){
        
       //console.log("Task "+task2_id+" depends on task "+task1_id)
        
        //see if it already has a dummy task on the same level
        
        
        if(!has_a_dummy_task(task1_id)){
            //console.log("Task "+task1_id+" doesnt have_a_dummy_task") 
            /*if(!(task1_id.depends_on[0] == "last" )){*/
        
            replace(task1_id,("X"+dummy_task_counter),get_activities_object_by_id(task2_id).depends_on)
    /*}*/
            activities.unshift({id:("X"+dummy_task_counter), depends_on:[task1_id],is_dummy_task:true})
            dummy_task_counter++
        }else{
            //console.log("Task "+task1_id+" has_a_dummy_task") 
            replace(task1_id,(has_a_dummy_task(task1_id).id),get_activities_object_by_id(task2_id).depends_on)
        }
        
        
        
        
       }else if(get_activities_object_by_id(task1_id).depends_on.includes(task2_id)){
           
            //see if it already has a dummy task on the same level
        
        if(!has_a_dummy_task(task2_id)){
            ////console.log("Task "+task2_id+" doent depend on task "+task1_id)
            /*if(!(task2_id.depends_on[0] == "last" )){*/
            
            replace(task2_id,("X"+dummy_task_counter),get_activities_object_by_id(task1_id).depends_on)
            /*}*/
            activities.unshift({id:("X"+dummy_task_counter), depends_on:[task2_id],is_dummy_task:true})
            dummy_task_counter++
        }else{
            ////console.log("Task "+task2_id+" doesnt have_a_dummy_task")
            replace(task2_id,(has_a_dummy_task(task2_id).id),get_activities_object_by_id(task1_id).depends_on)
        }     
       } 
        
    
    }else if(task2_id=="last"){
        
        activities.unshift({id:("X"+dummy_task_counter), depends_on:[task1_id],is_dummy_task:true})
        
    }else if(task1_id=="last"){
        
        activities.unshift({id:("X"+dummy_task_counter), depends_on:[task2_id],is_dummy_task:true})
        
    }
    } 
// sets level to a dummy task and re sort activities called after creating a dummy task
function sort_activities(){
    set_levels_for_all_activities()
    
}

function create_dummy_tasks(){
    sort_activities()
       var relations_array=[]
        
     for(var l=0;l<activities.length;l++){
     for(var j=0;j<activities[l].depends_on.length;j++){
      //   //console.log("get_max_level(activities[l]) ")
      // //console.log(get_max_level(activities[l].id))
      // //console.log("(get_levels_of_task_array_ids(activities[l].depends_on[j])[0])")
      // //console.log((get_levels_of_task_array_ids(activities[l].depends_on[j])[0]))
      //detect dummy task position
         
//console.log("activity "+activities[l].id +" of level "+activities[l].activity_level +" is is being compared with activity "+get_activities_object_by_id(activities[l].depends_on[j]).id+" of level "+get_activities_object_by_id(activities[l].depends_on[j]).activity_level)
         
         
         
/*if(activities[l].activity_level== 
                (get_activities_object_by_id(activities[l].depends_on[j]).activity_level)){
                         same_level_relations_array.push([activities[l].id,activities[l].depends_on[j]])
                         
                         }else*/
    if((get_max_level(activities[l].id)-1) == (get_levels_of_task_array_ids(activities[l].depends_on[j])[0])){
       
////console.log(activities[l].id+" depends on task "+activities[l].depends_on[j]+" with a level less than its max level-by one-")
        relations_array.push([activities[l].id,activities[l].depends_on[j]])
        
        
        /* later on a separet function create_dummy_task_between(activities[l].id,activities[l].depends_on[j])*/
        
       }else if(get_max_level(activities[l].id) > (get_levels_of_task_array_ids(activities[l].depends_on[j])[0])){
           
                far_relations_array.push([activities[l].id,activities[l].depends_on[j]])
           
        } 
    
}
}
     last_tasks_j=JSON.parse(JSON.stringify(get_last_tasks()))
    
       ////console.log("get_level_of(last_tasks[k]) > get_max_level(last_tasks[k])")
       ////console.log(last_tasks)
       ////console.log(get_levels_of_task_array_ids(last_tasks))
    
    for(var k=0;k<last_tasks_j.length;k++){
       if(get_level_of(last_tasks_j[k]) == Math.max.apply(null, get_levels_of_task_array_ids(last_tasks_j))-1){
        //console.log("true for "+last_tasks_j[k])
        ////console.log("create dummy task that depends on"+last_tasks[k])
        
        relations_array.push([last_tasks_j[k],"last"])
        //console.log(relations_array)
           }
        
    }
    
    
    //last array dummy task relation betwwen last tasks and last nodes
  //  get_levels_of_task_array_ids(get_last_tasks())

    
    
    //creates dummy task based on the relations array
 for(var rl=0;rl<relations_array.length;rl++){
     create_dummy_task_between(relations_array[rl][0],relations_array[rl][1])}
    
    
    sort_activities()

/*for(var frl=0;frl<far_relations_array.length;frl++){
    
     create_far_dummy_task_between(far_relations_array[frl][0],far_relations_array[frl][1])}
   */
    sort_activities()


}



//------------------------------------input table functions-------------------------------------------
row_counter=0
function add_empty_row(){
    var new_row
    
data_table=document.getElementById("table");
    tbody=data_table.appendChild(document.createElement('tbody'))
    new_row=tbody.insertRow(-1)
    new_row.id="task_row"+row_counter
    var cell_id =           new_row.insertCell(0);
        cell_id.innerHTML='<input class="number" type="text" value="'+row_counter+'">'
    
    var cell_description =  new_row.insertCell(-1);
        cell_description.innerHTML ='<input class="description"    type="text" value="" >'
    
    var cell_code =         new_row.insertCell(-1);
        cell_code.innerHTML ='<input class="code"          type="text" value="" >'
    var depends_on =  new_row.insertCell(-1);
        depends_on.innerHTML ='<input class="depends_on"    type="text" value="" >'
    
    
    var cell_op =           new_row.insertCell(-1);
        cell_op.innerHTML ='<input class="op"            type="text" value="" >'
    var cell_ml =           new_row.insertCell(-1);
        cell_ml.innerHTML ='<input class="ml"            type="text" value="" >'
    var cell_ps =           new_row.insertCell(-1);
        cell_ps.innerHTML ='<input class="ps"            type="text" value="" >'
    row_counter++
}
/*function add_empty_row(){
    document.getElementById("table").innerHTML += `<tr id="task_row`+row_counter+`">
                
<td><input class="number"        type="text" value="`+row_counter+`" ></td>
<td><input class="description"   type="text" value="" ></td>
<td><input class="code"          type="text" value="" ></td>
<td><input class="depends_on"    type="text" value="" ></td>
<td><input class="op"            type="text" value="" ></td>
<td><input class="ml"            type="text" value="" ></td>
<td><input class="ps"            type="text" value="" ></td>
            </tr>`
    row_counter++
}*/
function fill_table_from(activities_array){
    empty_table()
for(var i=0;i<activities_array.length;i++){
    document.getElementById("table").innerHTML += `<tr class="row" id="task_row`+row_counter+`">
<td><input id="number"       type="text" value="`+row_counter+`" ></td>                
<td><input id="description"  onchange="update_input(this,this.value)" type="text" value="" ></td>
<td><input id="code"         onchange="update_input(this,this.value)" type="text" value="`+activities_array[i].id+`"></td>
<td><input id="depends_on"   onchange="update_input(this,this.value)" type="text" value="`+activities_array[i].depends_on+`"></td>
<td><input id="op"           onchange="update_input(this,this.value)" type="text" value="" ></td>
<td><input id="ml"           onchange="update_input(this,this.val)"   type="text" value="" ></td>
<td><input id="ps"           onchange="update_input(this,this.value)" type="text" value="" ></td></tr>`
    row_counter++
}}

function update_input(input_obj,val){
    //console.log(input_obj)
    //console.log(val)
    
    
document.getElementById(this.id).value = val    
    
}


function empty_table(){
    row_counter=0
    document.getElementById("table").innerHTML = `<tr>
                <th width="5%" id="number" rowspan="2">#</th>
                <th width="30%" id="task_description_head" rowspan="2">Task description</th>
                <th width="10%" id="code_head" rowspan="2">Code</th>
                <th width="10%" id="depends_on_head" rowspan="2">Depends on</th>
                <th width="0%" id="duration_head" colspan="3">Duration</th>
            </tr>
            <tr>
               
                <th width="10%" id="op_head">Optimistic</th>
                <th width="10%" id="ml_head">Most likely</th>
                <th width="10%" id="ps_head">Pessimistic</th>
            </tr>`
}
/* later on a separet function create_dummy_task_between(activities[l].id,activities[l].depends_on[j])*/



//a dummy task is needed to be creaatetd between two tasks
//when a task includs a task or more that are 2 levels lower 
//A level 0 depends on null  0
//B level 0 depends on null  0
//H level 0 depends on null  0
//E level 1 depends on level A0
//C level 2 depends on level E1 and B0 and H0
//F level 2 depends on level E1 and B0 and H0
//D level 3 depends on level C2
//G level 4 depends on level D3 and F2
//call sort_activities then loop through activities
//to determin level of an activity, find hieghest level of tasks that it depends on, then add one

//-----------------------------------------------------------------------------------------
function set_levels_for_all_activities(){
    for(var l=0;l<activities.length;l++){
        if(activities[l].depends_on.length==0){
            activities[l]["activity_level"]=0
        }}
    var tasks_remaining_without_level =true
    while(tasks_remaining_without_level){
        tasks_remaining_without_level=false
    for(var l=0;l<activities.length;l++){
    for(var k=0;k<activities.length;k++){
        if(activities[l].depends_on.includes(activities[k].id) && 
           get_max_level(activities[l].id)==activities[k].activity_level){
           activities[l]["activity_level"]=activities[k].activity_level+1   
        }}
        if(activities[l].activity_level>-1){
            //console.log("task "+activities[l].id+" has level value assigned to it")
        }else{
            //console.log("task "+activities[l].id+" does not have a level value assigned to it yet")
            tasks_remaining_without_level=true
        }}}
    
    sort_activities_by_id_alpha_then_by_level()
    
}
function sort_activities_by_id_alpha_then_by_level(){
    activities.sort(function(a, b) {
    var textA = a.id.toUpperCase();
    var textB = b.id.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
})
    sort_activities_by_level()
}  
function sort_activities_by_level(){

activities.sort(function(a, b) {
  return a.activity_level - b.activity_level;
})

}
//-----------------------------------------------------------------------------------------
function get_level_of(task_id){
    //sort_activities()
  return  get_activities_object_by_id(task_id).activity_level
    
}
function get_levels_of_task_array_ids(task_array){
    var array_of_levels=[]
    for(var i=0;i<task_array.length;i++){
       array_of_levels.push(get_activities_object_by_id(task_array[i]).activity_level)
    }
    return array_of_levels
}
function get_max_level(activity_id){
    var arr = get_levels_of_task_array_ids(get_activities_object_by_id(activity_id).depends_on)
    return Math.max.apply(null, arr)
}
function get_min_level(activity_id){
    var arr = get_levels_of_task_array_ids(get_activities_object_by_id(activity_id).depends_on)
    return Math.min.apply(null, arr)
}
function get_unique_levels(activity_id){
    var arr = get_levels_of_task_array_ids(get_activities_object_by_id(activity_id).depends_on)
   return arr.filter(function (v,i,a){
        
        return a.indexOf(v) === i
    })
}

function get_all_unique_levels(){
    
       var unique_levels=[]
    var task_lv
          
    for(var i=0;i<activities.length;i++){
        
        task_lv=activities[i].activity_level
        if((unique_levels.indexOf(task_lv) == -1) /*&&
           (get_level_of(unique_random_tasks[0]) == get_level_of(unique_random_tasks[i]))*/){
            unique_levels.push(task_lv)
            //console.log(unique_levels)
        }
        
        
    }
    return unique_levels
    
 
}
//-----------------------------------------------------------------------------------------

//examples of special cases to handel:

//task level 9 depends on task level 3 and 5 and 7-------------done

//total levels 10, task level 3 doesnt have any task dependant on it
//total levels 10, task level 5 doesnt depend on any task

//task level 3 A depends on task B level 2-----draw far relation dummy task
//task level 4 C depends on task B level 2-----draw far relation dummy task

//two tasks has same starting and ending node

//two tasks at the same level depend on each other

function draw_grid(){
        ctx.beginPath()
        ctx.lineWidth=1;
    ctx.strokeStyle="rgba(255, 255, 255, 0.25)";

    x=0;
        while((x_distance_between_nodes*x)/2<w){
    ctx.moveTo((x_distance_between_nodes*x)/2,0);
    ctx.lineTo((x_distance_between_nodes*x)/2,h);
x++;
    }
    
  
    y=0;
       while((y_distance_between_nodes*y)/2<h){
    ctx.moveTo(0,(y_distance_between_nodes*y)/2);
    ctx.lineTo(w,(y_distance_between_nodes*y)/2);
y++;
    }
    
    
    ctx.stroke();
}

 
//first collect data from the table
function collect_table_data(){
    //console.log("function collect_table_data")
    var table_to_array=[]
    var e=0/*[[],[],[],[],[],[],[],[],[]]*/
data_table=document.getElementById("table");
    for(var r=0;r<data_table.rows.length;r++){
            if((data_table.rows[r].innerHTML.includes('input'))){
        //table_to_array.push([])
    for(var c=0;c<data_table.rows[r].cells.length;c++){
            var str=data_table.rows[r].cells[c].innerHTML
            
              if (data_table.rows[r].cells[c].innerHTML.includes('number')){
          number =        data_table.rows[r].cells[c].children[0].value
        }else if (data_table.rows[r].cells[c].innerHTML.includes('description')){
          description =   data_table.rows[r].cells[c].children[0].value
        }else if (data_table.rows[r].cells[c].innerHTML.includes('code')){
          code =          data_table.rows[r].cells[c].children[0].value
        }else if (data_table.rows[r].cells[c].innerHTML.includes('depends_on')){
          depends_on =    data_table.rows[r].cells[c].children[0].value
        }else if (data_table.rows[r].cells[c].innerHTML.includes('op')){
          op =            data_table.rows[r].cells[c].children[0].value
        }else if (data_table.rows[r].cells[c].innerHTML.includes('ml')){
          ml =            data_table.rows[r].cells[c].children[0].value
        }else if (data_table.rows[r].cells[c].innerHTML.includes('ps')){
          ps =            data_table.rows[r].cells[c].children[0].value
        }
    }
    
        //console.log(depends_on)
                
                //convert string to array before pushing activity object
            table_to_array.push({id:code,depends_on:convert_string_to_array(depends_on)});
                                    //add more later
            }
    }
        return table_to_array
}

function convert_string_to_array(string){
    if(string==""){
        return []
    }else{
        return string.split(/(?:,| )+/)
    }
    
}
function apply_and_build_nodes(){
    apply(build_nodes)
}
//put all the input data from the table into activities array
function apply(buildnodes){
    //console.log('calling apply')
    clear_canvas()
    activities=[]
 nodes=[]
 j_nodes=[]
 nodes_by_level=[]
 node_coordinates=[]
 organized_nodes=[]
 level_tasks=[]
 tasks=[]
 dummy_tasks_from_acts=[]
    far_relations_array=[]
    same_level_relations_array=[]
 dummy_task_counter=0
 activities= collect_table_data()
    
    buildnodes()
}
function clear_canvas(){
    ctx.clearRect(0,0,w,h)
    draw_grid()
    
}





function generate_random_table(collect_t_data){
    prev_tasks=[]
    empty_table()
    depends_on_tasks=[]
    for(var r=2;r<20;r++){
        add_empty_row()
        
    }
    
    data_table=document.getElementById("table");
    for(var r=2;r<data_table.rows.length;r++){
/*            if((data_table.rows[r].innerHTML.includes('input'))){*/
        task_code=task_codes[r-2]
                
        ////console.log(task_code)
                
        ////console.log("data_table.rows[r]")
        ////console.log(data_table.rows[r])
    for(var c=0;c<data_table.rows[r].cells.length;c++){
        //console.log("c: "+c)
            var str=data_table.rows[r].cells[c].innerHTML
            
              if (data_table.rows[r].cells[c].innerHTML.includes('number')){
               /*data_table.rows[r].cells[c].children[0].value = r*/
        }else if (data_table.rows[r].cells[c].innerHTML.includes('description')){
          /*description =   data_table.rows[r].cells[c].children[0].value*/
        }else if (data_table.rows[r].cells[c].innerHTML.includes('code')){
           data_table.rows[r].cells[c].children[0].value = task_code
        }else if (data_table.rows[r].cells[c].innerHTML.includes('depends_on')){
          data_table.rows[r].cells[c].children[0].value = depends_on_tasks
        }else if (data_table.rows[r].cells[c].innerHTML.includes('op')){
          /*op =            data_table.rows[r].cells[c].children[0].value*/
        }else if (data_table.rows[r].cells[c].innerHTML.includes('ml')){
          /*ml =            data_table.rows[r].cells[c].children[0].value*/
        }else if (data_table.rows[r].cells[c].innerHTML.includes('ps')){
          /*ps =            data_table.rows[r].cells[c].children[0].value*/
        }
    }
    
                                    //add more later
            /*}*/
        prev_tasks.push(task_codes[r-2])
        depends_on_tasks = return_array_of_unique_random_tasks_from(prev_tasks,Math.floor(prev_tasks.length/4))
    }
    
   // apply(build_nodes)
    activities= collect_t_data()
    
    apply(main)
    
}
function return_random_task_from(array){
    
    return array[Math.floor(Math.random()*array.length)]
}
//------------------------------------------where the returned tasks are on the same level
function return_array_of_unique_random_tasks_from(array,number_of_tasks){
    var unique_random_tasks=[]
    var random_task=""
          unique_random_tasks.push(return_random_task_from(array))
    for(var i=0;number_of_tasks>unique_random_tasks.length;i++){
        
        random_task=return_random_task_from(array)
        if((unique_random_tasks.indexOf(random_task) == -1) /*&&
           (get_level_of(unique_random_tasks[0]) == get_level_of(unique_random_tasks[i]))*/){
            unique_random_tasks.push(random_task)
            //console.log(unique_random_tasks)
        }
        
        
    }
    return unique_random_tasks
}


function f2a(){
    //console.log("f2 clicked")    
    //aoa
    
    main()
}

function f2n(){
    //aon
    prev_tasks=[]
    depends_on_tasks=[]
    build_nodes()
}


function f1(){
    //console.log("f1 clicked")
    fill_table_from(activities_fill)
    activities=activities_fill
}

function f3(){
    //console.log("f3 clicked")
     prev_tasks=[]
    depends_on_tasks=[]
    empty_table()
    apply(function (){})
}
function f4(){
    //console.log("f4 clicked")
    add_empty_row()
}
function f5(){
    //console.log("f5 clicked")
    generate_random_table(collect_table_data)
   // aply()
}



//if
//loops
//data types: arrays
//object oriented programing languages
//classes objects
//functions

//PATH finding
//short test path

//one direction graph
//weighted graphs
//long short term memory

//cloud aws


//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//----------------------------------------------AON/AOA-------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

function build_aon_nodes(){
    aon_nodes=[]
    //each node represents a task
    set_levels_for_all_activities()
    var level_offset=1
    //var levels=get_all_unique_levels()
     aon_by_level=build_aon_by_level()
    
    
    max_number_of_nodes=get_max_aon_on_levels()
    for(var i=0;i<aon_by_level.length;i++){
        
    number_of_nodes_on_this_level= aon_by_level[i].length
    level_offset= ((y_distance_between_nodes * max_number_of_nodes)/2) -
                  ((y_distance_between_nodes * number_of_nodes_on_this_level)/2)
        
    for(var j=0;j<aon_by_level[i].length;j++){
    aon_nodes.push({
        task_id:aon_by_level[i][j].id,
        tasks_before:aon_by_level[i][j].depends_on,
        level:aon_by_level[i][j].activity_level,
        x:margin_x+x_distance_between_nodes*i,
        y:margin_y+level_offset+y_distance_between_nodes*j
        
    })}}
    
    
    //
    
   return aon_nodes
    
    
}

function build_aon_by_level(){
    var aon_by_level=[] 
    var c=0
    for(var N=0;N<get_all_unique_levels().length;N++){
          aon_by_level.push([])
    for(var L=0;L<activities.length;L++){
      if(activities[L].activity_level==c){
        aon_by_level[c].push(activities[L])
         }
        
        
    }
         c++
    }
//console.log(aon_by_level)
return aon_by_level
    //nodes_by_level.unshift([nodes[0].node_id])
    //nodes_by_level.push([nodes[nodes.length-1].node_id])
}

function draw_aon_by_level(){
for(var L=0;L<aon_nodes.length;L++){

    //console.log("aon_by_level[L].task_id")
    //console.log(aon_by_level[L])
    draw_node(aon_nodes[L].x,aon_nodes[L].y,aon_nodes[L].task_id)
    
    

}
}

function draw_lines_between_tasks(){
    
    for(var L=0;L<aon_nodes.length;L++){
if(aon_nodes[L].tasks_before.length != 0){
    for(var B=0;B<aon_nodes[L].tasks_before.length;B++){
     draw_line_between(aon_nodes[L].task_id,aon_nodes[L].tasks_before[B])
    
}}}}

function main(){
    clear_canvas()
    set_levels_for_all_activities()
    build_aon_by_level()
    build_aon_nodes()
    draw_lines_between_tasks()
    draw_aon_by_level()
}

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

//a level of an activity is equal to the highest level it depends on +1

//A level 0 depends on null  0
//B level 0 depends on null  0
//H level 0 depends on null  0
//E level 1 depends on level A0
//x0level 1 depends on level B0
//x1level 1 depends on level H0
//C level 2 depends on level E1 and x0 1 and x1 1
//F level 2 depends on level E1 and x0 1 and x1 1
//x3level 3 depends on level F2 
//D level 3 depends on level C2
//G level 4 depends on level D3 and x3


/*else if(!(intersect(activities[i].depends_on,activities_by_level[0]).length==0) &&
             !(difference(activities[i].depends_on,activities_by_level[0]).length==0)){
        //see how many levels betwwen them now lets asume just one
        //create dummy tasks before
        for(var j=0;j<(difference(activities[i].depends_on,activities_by_level[0])).length;j++){
//get_task_object_by_id(difference(activities[i].depends_on,activities_by_level[0])[j]).level
        
        
        
        
    
        //console.log(get_task_object_by_id(difference(activities[i].depends_on,activities_by_level[0])[j]))
          // //console.log("i:" + i) 
        //   //console.log("j:" + j) 
    }
    }*/


/*
//------------------------------------------------------------------------------------------------------
//sorts the acctivities array based on the dependencies of tasksit also uses sort_acts() for better resault
function sort_activities(){
    sort_acts()
    var sorted_activities=[]
    var sorted_activities_backup=[]
    for(var i=0;i<activities.length;i++){
        if(activities[i].depends_on.length==0){
           sorted_activities_backup.push(activities[i])
           sorted_activities.push(activities[i].id)
                   
    if (activities.indexOf(activities[i]) > -1) {
        activities.splice(activities.indexOf(activities[i]), 1);i--}}} 
    
    while (activities.length>0){
for(var l=0;l<activities.length;l++){
               if(intersect(activities[l].depends_on,sorted_activities).length>0){
                   sorted_activities_backup.push(activities[l])
                   sorted_activities.push(activities[l].id)
                   
               if(activities.indexOf(activities[l]) > -1){
                       activities.splice(activities.indexOf(activities[l]), 1)
                       l--}
               }}}
    activities=sorted_activities_backup
    sort_acts()
//return activities
}
//sorts the acctivities array using .sort() method, this function is used in sort_activities()
function sort_acts(){ 
    activities.sort(function(a, b) {

  if (b.depends_on.includes(a.id)  || a.depends_on.length==0) {
     // //console.log("returning -1")
    return -1;
  }
  if (a.depends_on.includes(b.id) || !(a.depends_on.length==0)) {
     // //console.log("returning 1")
    return 1;
  }
  // a must be equal to b
  
})
}
//------------------------------------------------------------------------------------------------------
*/

//later get lenghth of tallest level figurout center
//each level should be centered
//node_coordinates=[[x,y,ID],...]

/*    for(var i=tasks[level].length-1;i>-1;i--){
//console.log(tasks[level][i].depends_on)
}*/

/*   while exitloop=false{
        level=1
        //initial tasks
    for(var i=0;i<activities.length;i++){
        if(activities[i].depends_on.length==0){
        node[1].push({id:activities[i].id,x:150,y:50+100*i,r:20})
            //console.log(i)
           }}
    
    
        var k=0
        for(var l=0;l<node[1].length;l++){
        for(var i=0;i<activities.length;i++){
        if(activities[i].depends_on.includes(node[1][l].id)){
        node[2].push({id:activities[i].id,x:250,y:50+100*k,r:20})
            k++
           }}}
    
    
    var k=0
        for(var l=0;l<node[2].length;l++){
        for(var i=0;i<activities.length;i++){
        if(activities[i].depends_on.includes(node[2][l].id)){
        node[3].push({id:activities[i].id,x:350,y:50+100*k,r:20})
            k++
           }}}
        
        exitloop=true
        }*/

/*

function moveto(x,y){
    ctx.moveTo(x,h-y)
}
function lineto(x,y){   
    ctx.lineTo(x,h-y)
    ctx.stroke()
}

main_lines=[]    
for(var i=0;i<activities.length;i++){main_lines.push(activities[i].id)}
for(var l=0;l<tasks.length;l++){
for(var i=0;i<tasks[l].length;i++){
   get_tasks_after(tasks[l][i].id)
    
    
    nodes.push({tasks_before:["A"],tasks_after:["D"]})
    nodes.push({tasks_before:["B"],tasks_after:["E"]})
    nodes.push({tasks_before:["C"],tasks_after:["F","G"]})
    
    if(tasks[i].findIndex(x => x.id === 'A')>-1){
    //console.log(tasks[i].find(x => x.id === 'A').depends_on)
}

}
}*/  
//organize_nodes()
/*function organize_nodes(){
    
    for(var i=0;i<number_of_levels;i++){
        
    for(var j=0;j<number_of_nodes_on_level(i);j++){
        organized_nodes.push({x:50+100*i,y:50+100*j,r:20})
        
        //draw 3 nodes
        
        
        
}
}
    
    for(var j=0;j<nodes.length;j++){
       // draw_node( organized_nodes[j])
        

}
    
}*/
////console.log({tasks_before:tasks_before,tasks_after:tasks_after})
    //if(!nodes.includes({tasks_before:tasks_before,tasks_after:tasks_after})){
        
    
        
    //}
/* for(var i=0;i<tasks.length;i++){
        tasks[i].from_node=get_starting_node_id_of_task(tasks[i].id)
        tasks[i].to_node=get_ending_node_id_of_task(tasks[i].id)
    }*/
    /*for(var i=0;i<nodes.length;i++){
        if(nodes[i]["tasks_after"]===(tasks_after)){
        //console.log("tasks_after")
        //console.log(tasks_after)
        //console.log("nodes[i]['tasks_after']")
        //console.log(nodes[i]["tasks_after"])
        //console.log("node "+i+" includes tasks_after: ")
            //console.log("------------------")
       
        }
           }  */
    
        //if(!skip_node){
        /*else if(l<activities.length-2){
            tasks_before=get_tasks_before(activities[l].id)
            //console.log("middle with no tasks after")
           // nodes.push({node_id:"",tasks_before:tasks_before,tasks_after:tasks_after})
        }else if(tasks_after.length==0){
            
            tasks_before=get_tasks_before("end")
            //nodes.push({node_id:"",tasks_before:tasks_before,tasks_after:tasks_after})
            //console.log("ending node")
            //console.log(tasks_before)
            
       }*/

 //from_node:get_starting_node_id_of_task(activities[i].id),to_node:get_ending_node_id_of_task(activities[i].id)
   // tasks.push([{id:"end",depends_on:tasks[tasks.length-2],x:150+100*level,y:50+100*c,r:20}])
  /*  for(var i=0;i<tasks[tasks.length-2].length;i++){
        draw_line(tasks[tasks.length-2][i].x,tasks[tasks.length-2][i].y,tasks[tasks.length-1][0].x,tasks[tasks.length-1][0].y)
} 
    
    for(var l=0;l<tasks.length;l++){
    for(var i=0;i<tasks[l].length;i++){
        if(tasks[l+1]){
    for(var j=0;j<tasks[l+1].length;j++){
       ////console.log(tasks[l+1][j].depends_on)
       //console.log(tasks[l+1][j])
       /*console.log("i: "+i)
       //console.log("j: "+j)
       if(tasks[l+1][j].depends_on.includes(tasks[l][i].id) || tasks[l+1][j].depends_on.length==0 
           ){
        draw_line(tasks[l][i].x,tasks[l][i].y,tasks[l+1][j].x,tasks[l+1][j].y)
        }
        //end nodes
     draw_node(tasks[tasks.length-1][tasks[tasks.length-1].length-1])
        draw_node(tasks[l][i])   
        
    }
        }
    }
    }
     */
    


/*


    
           
activities1=[
    {id:"G",
    depends_on:["D","F","E"]
    },{id:"C",
    depends_on:["A"]
    },{id:"F",
    depends_on:["A"]
    },{id:"B",
    depends_on:[]
    },{id:"H",
    depends_on:[]
    },{id:"A",
    depends_on:[]
    },{id:"E",
    depends_on:["H"]
    },{id:"D",
    depends_on:["C"]
    }
    ]
activities00=[
    {id:"A",
    depends_on:[]
    },{id:"B",
    depends_on:[]
    },{id:"C",
    depends_on:["A"]
    },{id:"D",
    depends_on:["A"]
    },{id:"E",
    depends_on:["A"]
    },{id:"F",
    depends_on:["B","C"]
    },{id:"G",
    depends_on:["B","C"]
    },{id:"H",
    depends_on:["E","F"]
    },{id:"I",
    depends_on:["E","F"]
    },{id:"J",
    depends_on:["H"]
    },{id:"K",
    depends_on:["G","I"]
    }
    ]

activities0=[
    {id:"A",
    depends_on:[],
     duration:{
         optimistic:5,
         mostlikely:6,
         pessimistic:7
     }
    },
    {id:"B",
    depends_on:[],
     duration:{
         optimistic:1,
         mostlikely:3,
         pessimistic:5
     }
    },
    {id:"C",
    depends_on:[],
     duration:{
         optimistic:1,
         mostlikely:4,
         pessimistic:7
     }
    },
    {id:"D",
    depends_on:["A"],
     duration:{
         optimistic:1,
         mostlikely:2,
         pessimistic:3
     }
    },
    {id:"E",
    depends_on:["B"],
     duration:{
         optimistic:1,
         mostlikely:2,
         pessimistic:9
     }
    },
    {id:"F",
    depends_on:["C"],
     duration:{
         optimistic:1,
         mostlikely:5,
         pessimistic:9
     }
    },
    {id:"G",
    depends_on:["C"],
     duration:{
         optimistic:2,
         mostlikely:2,
         pessimistic:8
     }
    },
    {id:"H",
    depends_on:["E","F","D"],
     duration:{
         optimistic:4,
         mostlikely:4,
         pessimistic:10
     }
    },
    {id:"Y",
    depends_on:["G"],
     duration:{
         optimistic:4,
         mostlikely:4,
         pessimistic:10
     }
    },
    {id:"I",
    depends_on:["D","Y"],
     duration:{
         optimistic:2,
         mostlikely:5,
         pessimistic:8
     }
    },

    {id:"J",
    depends_on:["H","G"],
     duration:{
         optimistic:2,
         mostlikely:2,
         pessimistic:8
     }
    }]
//fill_table_from(activities)
activities000=[
    {id:"A",
    depends_on:[],
     duration:{
         optimistic:5,
         mostlikely:6,
         pessimistic:7
     }
    },
    {id:"B",
    depends_on:[],
     duration:{
         optimistic:1,
         mostlikely:3,
         pessimistic:5
     }
    },
    {id:"C",
    depends_on:[],
     duration:{
         optimistic:1,
         mostlikely:4,
         pessimistic:7
     }
    },
    {id:"D",
    depends_on:["A"],
     duration:{
         optimistic:1,
         mostlikely:2,
         pessimistic:3
     }
    },
    {id:"E",
    depends_on:["B"],
     duration:{
         optimistic:1,
         mostlikely:2,
         pessimistic:9
     }
    },
    {id:"F",
    depends_on:["C"],
     duration:{
         optimistic:1,
         mostlikely:5,
         pessimistic:9
     }
    },
    {id:"G",
    depends_on:["C"],
     duration:{
         optimistic:2,
         mostlikely:2,
         pessimistic:8
     }
    },
    {id:"H",
    depends_on:["E","F"],
     duration:{
         optimistic:4,
         mostlikely:4,
         pessimistic:10
     }
    },
    {id:"I",
    depends_on:["D"],
     duration:{
         optimistic:2,
         mostlikely:5,
         pessimistic:8
     }
    },
    {id:"J",
    depends_on:["H","G"],
     duration:{
         optimistic:2,
         mostlikely:2,
         pessimistic:8
     }
    }
    
    
           
           
           
           
           
           
           ]




*/