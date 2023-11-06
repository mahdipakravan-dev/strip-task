import './App.css'
import useForm from "./hooks/useForm.ts";
import {object, string} from "yup";

const schema = object().shape({
  name : string().required("name is required"),
  email : string().required("email is required").email("email is invalid"),
  password : string().required("password is required").min(6, "password must be at least 6 characters"),
  confirmPassword : string().required("confirm password is required").test((value , ctx) => {
      if(value === ctx.parent.password) return true;
      else return false;
  })
})
interface IUserRegister {
    name : string;
    email : string;
    password : string;
    confirmPassword : string;
}
function App() {
  const {
      control,
      isValid,
      isIdle,
      errors,
      onSubmit
  } = useForm<IUserRegister>({
    mode : "onSubmit",
    validateSchema : schema
  })
  const handleSubmit = (values : IUserRegister) => {
    console.log("submitMode : " , values)
  }

  return (
    <>
      <form action="" onSubmit={onSubmit(handleSubmit)}>

        {!isIdle &&
            <>
                ({isValid ? <p>Form is valid✅</p> : <p>Form is invalid❌</p>})
            </>
        }

        {!isValid &&
            errors.map((error) => (
                <li>{error}</li>
            ))
        }

        <label htmlFor="name">Name</label>
        <input type="text" name="name" {...control("name")}/>

        <label htmlFor="Email">Email</label>
        <input type="text" name="email" {...control("email")}/>

        <label htmlFor="password">Password</label>
        <input type="password" name="password" {...control("password")}/>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" name="confirmPassword" {...control("confirmPassword")}/>

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
