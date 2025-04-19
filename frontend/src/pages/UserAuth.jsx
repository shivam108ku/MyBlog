import React, { useContext, useRef } from 'react';
import Input from '../components/Input';
import google from '../imgs/google.png'
import { Link } from 'react-router'
import PageAnimation from '../common/PageAnimation';
import {Toaster, toast} from 'react-hot-toast' 
import axios from 'axios';
import { storeInSession } from '../common/Session';
import { UserContext } from '../App';


const UserAuth = ({ type }) => {
  
  let { userAuth, setAuth } = useContext(UserContext);
const accessToken = userAuth?.access_token || null;
console.log('Access Token:', accessToken);

  const UserAuthThroughServer = (serverRoute, formData)=>{
    console.log(import.meta.env.VITE_SERVER_DOMAIN); // check this

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
    .then(({data})=>{
      storeInSession("user",JSON.stringify(data))
       
      setAuth(data);
    })
    .catch((err) => {
      const errorMessage = err.response?.data?.error || "Something went wrong. Please try again!";
      toast.error(errorMessage);
    })
  }    

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;   // regex for password
                             
    // form data
    let form = new FormData(formElement);
    console.log(form)
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    if (fullname){
      if (fullname.length < 3) {
        return toast.error( "Fullname must be at least 3 letters long" )
      }
    }
    if (!email.length) {
      return toast.error( "Email is invalid" )
    }
    if (!emailRegex.test(email)) {
      return toast.error( "invalid credentials" )
    }
    if (!passwordRegex.test(password)) {
      return toast.error( "Password should be 6 to 20 characters" )
    }

    UserAuthThroughServer(serverRoute,formData)
  }

  return (
    
    
    <PageAnimation keyValue={type} >
      <section className="h-[70vh] md:h-[90vh] w-full flex items-center justify-center bg-gray-50 overflow-hidden">
       <Toaster/>
       
        <form id='formElement' className="w-[90%] max-w-sm bg-white p-6 rounded-xl shadow-lg space-y-5">
          <h1 className="text-2xl font-semibold capitalize text-center text-gray-800">
            {type === 'sign-in' ? 'Welcome Back ' : 'Join Us Today'}
          </h1>

          {
            type != "sign-in" ?
              <Input
                name="fullname"
                type="text"
                placeholder="Full Name"
                icon="ri-user-line"
              />
              : ""
          }
          <Input
            name="email"
            type="email"
            placeholder="Email"
            icon="ri-mail-line"
          />

          <Input
            name="password"
            type="password"
            placeholder="password"
            icon="ri-key-line"
          />

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {type === 'sign-up' ? 'Sign Up' : 'Sign In'}

          </button>

          <div className="flex items-center my-1">
            <hr className="flex-grow border-t border-gray-300" />
            <p className="mx-4 text-zinc-400">or</p>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <button className="p-3 w-[90%] ml-3 flex justify-center gap-2 items-center text-white
         font-light text-sm rounded-full bg-black">
            <img className='w-4' src={google} alt="" />
            Continue with Google
          </button>

          {

            type == "sign-in" ?
              <p className='mt-6'>
                Don't have an account ?
                <Link to='/signup'
                  className='underline text-black text-md ml-1'
                >
                  Join us
                </Link>
              </p>
              :
              <p className='mt-6'>
                Already a member ?
                <Link to='/signin'
                  className='underline text-black text-md ml-1'
                >
                  Sign In here.
                </Link>
              </p>
          }


        </form>
      
      </section>
    </PageAnimation>
  );
};

export default UserAuth;
