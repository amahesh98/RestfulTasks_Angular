var express=require('express')
var app=express()
var mongoose=require('mongoose')
var path=require('path')
var bodyParser=require('body-parser')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public/dist/public')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/RestfulTasksDB')
var TaskSchema=new mongoose.Schema({
    name:{type:String, required:[true, 'Name is required']},
    description:{type:String, required:[true, 'Description is required']},
    completed:{type:Boolean, default:false, required:[true, 'Completed is required']}
}, {timestamps:true})
mongoose.model('Task', TaskSchema)
var Task = mongoose.model('Task')

// app.get('/', function(request, response){
//     response.send('<a href=\'/tasks\'>Tasks</a>')
// })

app.get('/tasks', function(request, response){
    Task.find({}, function(error, tasks){
        if(error){
            response.json({success:0, message:"There was an error"})
        }
        else{
            response.json({success:1, message:"Successfully fetched all tasks", tasks:tasks})
        }
    })
})

app.post('/tasks', function(request, response){
    console.log("recieved request")
    console.log(request.body)
    var newTask=new Task(request.body)
    newTask.save(function(error){
        if(error){
            response.json({success:0, message:'Could not create a task with the posted information'})
        }
        else{
            response.json({success:1, message:'Successfully created task!', task:newTask})
        }
    })
})
app.get('/tasks/:taskID', function(request, response){
    Task.findOne({_id:request.params.taskID}, function(error, task){
        if(error){
            response.json({success:0, message:"Invalid ID"})
        }
        else{
            if(task==null){
                response.json({success:0, message:"Could not find task with this ID"})
            }
            else{
                response.json({success:1, message:"Found the task", task:task})
            }
        }
    })
})
app.put('/tasks/:taskID', function(request, response){
    // response.json({message:"Got your request"})
    console.log("Recieved put request")
    Task.findOne({_id:request.params.taskID}, function(error, task){
        console.log(task)
        if(error){
            response.json({success:0, message:"Invalid id"})
        }
        else{
            if(task==null){
                response.json({success:0, message:"Could not find task with this id"})
            }
            else{
                task.name=request.body.name
                task.description=request.body.description
                task.completed=request.body.completed
                task.updatedAt=new Date()
                task.save(function(err){
                    if(error){
                        response.json({success:0, message:"Invalid parameters, REQUIRED = name:[string], description:[string], completed:[bool]"})
                    }
                    else{
                        response.json({success:1, message:'Successfully updated task', task:task})
                    }
                })
            }
        }
    })
})
app.delete('/tasks/:taskID', function(request, response){
    Task.deleteOne({_id:request.params.taskID}, function(error){
        if(error){
            response.json({success:0, message:"Error deleting this object"})
        }
        else{
            response.json({success:1, message:"Successfully deleted"})
        }
    })
})

app.listen(8000, function(){
    console.log("Listening on port 8000")
})