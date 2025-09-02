import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PlusCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import CreateTemplateDialog from "@/components/CreateTemplateDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { updateTemplate, deleteTemplate } from "@/redux/userSlice";
import axios from "axios";
import { API_URL } from "../../constants/config";
import { toast } from "react-toastify";
import { useIsMobile } from "../hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ManageTemplates() {
  const templates = useSelector(
    (state) => state.user.userData?.templates || []
  );
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [viewed, setViewed] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", subject: "", body: "" });

  // Handler for delete (to be implemented with API call)
  const handleDelete = async (tplId) => {
    try {
      const response = await axios.delete(
        API_URL + "/api/template/deletetemplate/" + tplId,
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(deleteTemplate(tplId));
        toast.success("Template deleted successfully");
      } else {
        toast.error("Unable to delete template");
      }
    } catch (err) {
      toast.error("Unable to delete template");
    }
  };

  // Handler for update (to be implemented with API call)
  const handleEditSave = async () => {
    try {
      const response = await axios.put(
        API_URL + "/api/template/updatetemplate/" + editing._id,
        {
          name: editForm.name,
          subject: editForm.subject,
          body: editForm.body,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(
          updateTemplate({
            id: editing._id,
            name: editForm.name,
            subject: editForm.subject,
            body: editForm.body,
          })
        );
        toast.success("Template updated successfully");
      } else {
        toast.error("Unable to update template");
      }
    } catch (err) {
      toast.error("Unable to update template", err);
    }
    setEditing(null);
  };

  // Open edit modal and prefill form
  const openEdit = (tpl) => {
    setEditForm({ name: tpl.name, subject: tpl.subject, body: tpl.body });
    setEditing(tpl);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          <h2 className="text-xl md:text-2xl font-bold">Templates</h2>
        </div>
        <CreateTemplateDialog
          onCreate={(tpl) => setTemplates((prev) => [...prev, tpl])}
        >
          <Button className="flex items-center w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </CreateTemplateDialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No templates yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first template to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-4">
              {templates.map((tpl) => (
                <Card key={tpl._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {tpl.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {tpl.subject}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewed(tpl)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(tpl)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(tpl._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Name</th>
                        <th className="text-left p-4 font-medium">Subject</th>
                        <th className="text-center p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((tpl) => (
                        <tr
                          key={tpl._id}
                          className="border-b hover:bg-muted/25"
                        >
                          <td className="p-4">
                            <div className="max-w-[200px] truncate font-medium">
                              {tpl.name}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="max-w-[300px] truncate">
                              {tpl.subject}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewed(tpl)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEdit(tpl)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(tpl._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Modal for viewing template */}
      {viewed && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-border shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setViewed(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">{viewed.name}</h3>
            <div className="mb-2 text-sm text-gray-600">
              Subject: {viewed.subject}
            </div>
            <div className="whitespace-pre-line text-gray-800 border-t pt-2">
              {viewed.body}
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing template */}
      {editing && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white border border-border rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setEditing(null)}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-2">Edit Template</h3>
            <div className="mb-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Subject</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={editForm.subject}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, subject: e.target.value }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Body</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                rows={5}
                value={editForm.body}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, body: e.target.value }))
                }
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="px-4 mx-2 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleEditSave}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
