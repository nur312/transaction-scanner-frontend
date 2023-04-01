import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import "./Auth.css";

function SignUp(props) {

    const formSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .matches(/^[a-z0-9]*$/i, { message: "Only lowercase letters and numbers are allowed" })
            .min(5, 'Password length should be at least 5 characters'),
        passwordConfirm: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must and should match'),
        username: Yup.string()
            .matches(/^[a-z0-9]*$/i, { message: "Only lowercase letters and numbers are allowed" })
            .required('Username is required')
            .min(5, 'Username length should be at least 5 characters'),

    });

    const validationOpt = { resolver: yupResolver(formSchema) }

    const { register, handleSubmit, formState } = useForm(validationOpt)

    const { errors } = formState

    console.log(errors);

    return (
        <div className="authContainer">
            <p className="invisible">Prrr</p>
            <form onSubmit={handleSubmit(props.signUp)}>
                <h2>Add a Operator</h2>
                <div className="ui divider"></div>
                <div className="ui form">
                    <div className="field">
                        <label>Your username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 5,
                                    message: "Username must be more than 5 characters",
                                },
                                pattern: {
                                    value: /^[a-z0-9]*$/,
                                    message: 'Please enter a number',
                                },
                            })}
                        />
                    </div>
                    <p className="authP">{errors?.username?.message}</p>

                    <div className="field">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                        />
                    </div>
                    <p className="authP">{errors?.passwordConfirm?.message}</p>
                    <p className="authP">{errors?.password?.message}</p>

                    <div className="field">
                        <label>Password Confirmation</label>
                        <input
                            name="passwordConfirm"
                            type="password"
                            placeholder="Password Confirmation"
                            {...register("passwordConfirm")}
                        />
                    </div>
                    <p className="authP">{errors?.passwordConfirm?.message}</p>
                    <p className="authP">{errors?.password?.message}</p>
                </div>
                <button className="fluid ui button blue">Add The Operator</button>
            </form >
            <div className="signInUpFooter cPointer"  onClick={props.logout}>
                Logout
            </div>
        </div >
    );
}

export default SignUp;
