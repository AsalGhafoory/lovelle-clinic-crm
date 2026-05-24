import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

import {
  Mail,
  User,
  Phone,
  Trash2,
  FileText,
  CalendarDays
} from "lucide-react";

import { db } from "../firebase";

import Layout from "../components/Layout";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";
import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import LoadingCard from "../components/ui/LoadingCard";

import { formatDisplayDate } from "../utils/date";

export default function ClientProfile() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [client, setClient] = useState(null);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [noteInput, setNoteInput] = useState("");

  const [notes, setNotes] = useState([]);

  const [timeline, setTimeline] = useState([]);

  const [tagInput, setTagInput] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  const [savingNote, setSavingNote] = useState(false);

  const [savedMessage, setSavedMessage] = useState("");

  function showSavedMessage(message) {

    setSavedMessage(message);

    window.setTimeout(() => {

      setSavedMessage("");

    }, 2200);

  }

  useEffect(() => {

    const unsubscribeClient = onSnapshot(
      doc(db, "clients", id),
      (docSnap) => {

        if (docSnap.exists()) {

          const clientData = {
            id: docSnap.id,
            ...docSnap.data()
          };

          setClient(clientData);

          setName(clientData.name || "");
          setEmail(clientData.email || "");
          setPhone(clientData.phone || "");

        }

      }
    );

    const unsubscribeNotes = onSnapshot(
      collection(db, "clients", id, "notes"),
      (snapshot) => {

        const notesArray = [];

        snapshot.forEach((doc) => {

          notesArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setNotes(notesArray);

      }
    );

    const unsubscribeTimeline = onSnapshot(
      collection(db, "clients", id, "timeline"),
      (snapshot) => {

        const timelineArray = [];

        snapshot.forEach((doc) => {

          timelineArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setTimeline(timelineArray);

      }
    );

    return () => {

      unsubscribeClient();
      unsubscribeNotes();
      unsubscribeTimeline();

    };

  }, [id]);

  async function saveClientInfo() {

    try {

      setSavingProfile(true);

      await updateDoc(
        doc(db, "clients", id),
        {
          name,
          email,
          phone
        }
      );

      setEditing(false);
      showSavedMessage("Profile saved");

    } catch (error) {

      console.log(error);

    } finally {

      setSavingProfile(false);

    }

  }

  async function deleteClient() {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(db, "clients", id)
      );

      navigate("/clients");

    } catch (error) {

      console.log(error);

    }

  }

  async function addTag() {

    if (!tagInput.trim()) return;

    const updatedTags = [

      ...(client.tags || []),

      tagInput.trim()

    ];

    try {

      await updateDoc(
        doc(db, "clients", id),
        {
          tags: updatedTags
        }
      );

      setTagInput("");
      showSavedMessage("Tag added");

    } catch (error) {

      console.log(error);

    }

  }

  async function removeTag(tagToRemove) {

    const updatedTags = (client.tags || []).filter(
      (tag) => tag !== tagToRemove
    );

    try {

      await updateDoc(
        doc(db, "clients", id),
        {
          tags: updatedTags
        }
      );
      showSavedMessage("Tag removed");

    } catch (error) {

      console.log(error);

    }

  }

  async function addNote() {

    if (!noteInput.trim()) return;

    try {

      setSavingNote(true);

      await addDoc(
        collection(db, "clients", id, "notes"),
        {
          text: noteInput,
          createdAt: serverTimestamp()
        }
      );

      setNoteInput("");
      showSavedMessage("Note saved");

    } catch (error) {

      console.log(error);

    } finally {

      setSavingNote(false);

    }

  }

  async function deleteNote(noteId) {

    const confirmDelete = window.confirm(
      "Delete this note?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "clients",
          id,
          "notes",
          noteId
        )
      );
      showSavedMessage("Note deleted");

    } catch (error) {

      console.log(error);

    }

  }

  async function deleteTreatment(treatmentId) {

    const confirmDelete = window.confirm(
      "Delete this treatment?"
    );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "clients",
          id,
          "timeline",
          treatmentId
        )
      );
      showSavedMessage("Treatment deleted");

    } catch (error) {

      console.log(error);

    }

  }

  if (!client) {

    return (

      <Layout>

        <div className="flex items-center justify-center min-h-[70vh]">

          <div className="max-w-md w-full">

            <LoadingCard
              title="Loading Client"
              description="Fetching client profile..."
            />

          </div>

        </div>

      </Layout>

    );

  }

  return (

    <Layout>

      <div className="mb-10">

        <PageHeader
          eyebrow="Client Profile"
          title={client.name}
          description="
            Manage client information,
            wellness notes, and treatment history.
          "
        >

        <div className="flex flex-wrap gap-3">

          {savedMessage && (

            <Badge variant="light">
              {savedMessage}
            </Badge>

          )}

          <Link
            to="/appointments"
            className="
              px-5
              py-4
              rounded-[20px]
              border
              border-black/[0.06]
              bg-white/70
              text-sm
              font-medium
              text-gray-700
              hover:text-black
              hover:bg-white
            "
          >
            Book Appointment
          </Link>

          {!editing ? (

            <Button
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>

          ) : (

            <Button
              onClick={saveClientInfo}
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>

          )}

        </div>

        </PageHeader>

      </div>

      {/* TOP GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 mb-8">

        {/* CLIENT INFO */}

        <Card>

          <div className="flex items-center justify-between mb-10">

            <SectionHeader
              eyebrow="Client Details"
              title="Information"
            />

            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-[#f5f5f4]
                flex
                items-center
                justify-center
              "
            >

              <User size={26} />

            </div>

          </div>

          <div className="space-y-8">

            <div>

              <p className="text-gray-500 mb-3">
                Full Name
              </p>

              {editing ? (

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

              ) : (

                <p className="text-2xl font-semibold">
                  {client.name}
                </p>

              )}

            </div>

            <div>

              <p className="text-gray-500 mb-3">
                Email Address
              </p>

              {editing ? (

                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              ) : (

                <div className="flex items-center gap-3">

                  <Mail
                    size={18}
                    className="text-gray-400"
                  />

                  <p className="text-lg font-medium break-all">
                    {client.email}
                  </p>

                </div>

              )}

            </div>

            <div>

              <p className="text-gray-500 mb-3">
                Phone Number
              </p>

              {editing ? (

                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Add phone number..."
                />

              ) : (

                <div className="flex items-center gap-3">

                  <Phone
                    size={18}
                    className="text-gray-400"
                  />

                  <p className="text-lg font-medium">
                    {client.phone || "No phone added"}
                  </p>

                </div>

              )}

            </div>

            <div>

              <p className="text-gray-500 mb-3">
                Client Tags
              </p>

              <div className="flex gap-3 mb-4">

                <Input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />

                <Button
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="whitespace-nowrap"
                >
                  Add
                </Button>

              </div>

              <div className="flex flex-wrap gap-3">

                {client.tags?.length === 0 && (

                  <p className="text-gray-400">
                    No tags yet
                  </p>

                )}

                {client.tags?.map((tag) => (

                  <div
                    key={tag}
                    className="vela-tag"
                  >

                    {tag}

                    <button
                      onClick={() => removeTag(tag)}
                      className="vela-tag-remove"
                    >

                      ×

                    </button>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </Card>

        {/* NOTES */}

        <Card>

          <div className="flex items-center justify-between mb-8">

            <SectionHeader
              eyebrow="Internal Notes"
              title="Notes"
            />

            <FileText size={24} />

          </div>

          <Textarea
            placeholder="Add client notes..."
            className="mb-4"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
          />

          <Button
            onClick={addNote}
            disabled={savingNote}
            className="w-full mb-8"
          >
            {savingNote ? "Saving..." : "Save Note"}
          </Button>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">

            {notes.length === 0 && (

              <EmptyState
                title="No Notes Yet"
                description="Start documenting client preferences and wellness details."
              />

            )}

            {notes.map((note) => (

              <div
                key={note.id}
                className="
                  border
                  border-black/[0.04]
                  rounded-[24px]
                  p-5
                  bg-[#fcfcfb]
                "
              >

                <div className="flex items-start justify-between gap-4">

                  <p className="text-gray-700 leading-relaxed">
                    {note.text}
                  </p>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="
                      text-gray-400
                      hover:text-red-500
                      transition-colors
                      shrink-0
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            ))}

          </div>

        </Card>

      </div>

      {/* TREATMENTS */}

      <Card className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">

          <SectionHeader
            eyebrow="Wellness Sessions"
            title="Treatments"
          />

          <Badge variant="light">

            {timeline.length} Sessions

          </Badge>

        </div>

        {/* EMPTY STATE */}

        {timeline.length === 0 && (

          <EmptyState
            title="No Treatments Yet"
            description="
              Treatment history will appear here after completed
              appointments are documented.
            "
            actionLabel="Book Appointment"
            actionTo="/appointments"
          />

        )}

        {/* SESSION CARDS */}

        <div className="space-y-4">

          {timeline.map((item) => (

            <div
              key={item.id}
              className="
                border
                border-black/[0.04]
                rounded-[28px]
                p-6
                bg-[#fcfcfb]
                hover:bg-[#fafaf8]
                hover:shadow-lg
                hover:-translate-y-[2px]
                transition-all
                duration-300
              "
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div className="min-w-0">

                  <p className="text-2xl font-semibold truncate">
                    {item.treatment}
                  </p>

                  <p className="text-gray-500 mt-2">
                    Completed wellness session
                  </p>

                </div>

                <div className="flex items-center gap-3">

                  <div
                    className="
                      px-5
                      py-2
                      rounded-full
                      bg-[#f3f3f0]
                      border
                      border-black/[0.04]
                      flex
                      items-center
                      gap-3
                      text-sm
                      font-medium
                      text-gray-700
                    "
                  >

                    <CalendarDays size={16} />

                    {formatDisplayDate(item.date)}

                  </div>

                  <button
                    onClick={() => deleteTreatment(item.id)}
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-white
                      border
                      border-black/[0.06]
                      text-gray-400
                      hover:text-red-500
                      hover:bg-red-50
                      transition-all
                      duration-300
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </Card>

      {/* DELETE CLIENT */}

      <Card>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h3 className="text-2xl font-semibold mb-2">
              Archive Client
            </h3>

            <p className="text-gray-500 max-w-xl">

              Remove this client profile only when it is no longer needed.

            </p>

          </div>

          <button
            onClick={deleteClient}
            className="
              flex
              items-center
              justify-center
              gap-3
              px-6
              py-4
              rounded-[22px]
              bg-white
              border
              border-black/[0.06]
              text-gray-500
              hover:text-red-600
              hover:bg-red-50
              transition-all
              duration-300
            "
          >

            <Trash2 size={18} />

            Delete Client

          </button>

        </div>

      </Card>

    </Layout>

  );

}
