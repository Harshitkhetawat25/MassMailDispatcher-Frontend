"use client"

import {  useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import axios from "axios"
import { API_URL } from "../../constants/config"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"



export default function CreateTemplateDialog({ children, onCreate }) {
    
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  
 const templates = useSelector(state => state.user.userData?.templates || []);
 const dispatch = useDispatch();
const userData = useSelector(state => state.user.userData);
  function resetForm() {
    setName("")
    setSubject("")
    setBody("")
  }

  const handleSubmit = async (e) => {
  e?.preventDefault?.();
  if (!name.trim() || !subject.trim() || !body.trim()) {
    toast({
      title: "Missing information",
      description: "Please fill out Name, Subject, and Body.",
      variant: "destructive",
    });
    return;
  }
  try {
    setSubmitting(true);
    const response = await axios.post(API_URL + "/api/template/addtemplate", {
      name,
      subject,
      body,
    }, { withCredentials: true });

    resetForm();
    setOpen(false);

    if (response.status === 201 && response.data) {
        dispatch(setUserData({
          ...userData,
          templates: [...templates, response.data]
        }));
      }
    if (typeof onCreate === "function") {
      onCreate({ name: name.trim(), subject: subject.trim(), body: body.trim() });
    }
    toast.success({
      title: "Template created",
      description: "Your email template has been saved.",
    });
  } catch (err) {
    toast.error({
      title: "Unable to save template",
      description: "Please try again.",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};
  
  const Trigger = children ? (
    <DialogTrigger asChild>{children}</DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button size="sm" variant="default">
        Create Template
      </Button>
    </DialogTrigger>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {Trigger}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-pretty">Create Template</DialogTitle>
          <DialogDescription className="text-pretty">
            Define a reusable email template with a name, subject, and body.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="tpl-name">Template Name</Label>
            <Input
              id="tpl-name"
              placeholder="e.g., Welcome Campaign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tpl-subject">Subject</Label>
            <Input
              id="tpl-subject"
              placeholder="e.g., Welcome to our newsletter!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tpl-body">Body</Label>
            <Textarea
              id="tpl-body"
              placeholder="Write your email body here..."
              className="min-h-40"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Tip: You can include placeholders like {"{first_name}"} which you replace before sending.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save Template"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
    </Dialog>
  )
}
