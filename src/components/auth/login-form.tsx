import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";


const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập username'),
  password: z.string().min(1, 'Vui lòng nhập password'),
})
type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { logIn } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })
  const navigate = useNavigate()
  const onSubmit = async (data: LoginFormValues) => {
    const { username, password } = data;
    await logIn(username, password) &&
      navigate('/dashboard')
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Sử dụng tài khoản được gửi kèm CV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  {...register('username')}
                />
                {errors.username && (
                  <p className="text-destructive">{errors.username.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password"
                  type="password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-destructive">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >Login</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
