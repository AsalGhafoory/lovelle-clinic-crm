import { useEffect, useState } from "react";

import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import {
  Building2,
  CalendarClock,
  Check,
  Lock,
  Mail,
  Shield,
  UserRound
} from "lucide-react";

import {
  auth,
  db
} from "../firebase";

import Layout from "../components/Layout";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import SectionHeader from "../components/ui/SectionHeader";
import PageHeader from "../components/ui/PageHeader";
import LoadingCard from "../components/ui/LoadingCard";

const appointmentDurations = [
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "90 minutes"
];

function SettingRow({
  icon: Icon,
  title,
  description,
  children
}) {

  return (

    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-5
        py-6
        border-b
        border-black/[0.04]
        last:border-b-0
      "
    >

      <div className="flex items-start gap-4">

        <div
          className="
            w-11
            h-11
            rounded-2xl
            bg-[#f5f5f4]
            flex
            items-center
            justify-center
            shrink-0
          "
        >

          <Icon size={18} />

        </div>

        <div>

          <p className="font-semibold">
            {title}
          </p>

          <p className="text-sm text-gray-500 leading-relaxed mt-1 max-w-xl">
            {description}
          </p>

        </div>

      </div>

      <div className="sm:shrink-0">

        {children}

      </div>

    </div>

  );

}

export default function Settings() {

  const [clinicName, setClinicName] = useState("Lovelle Clinic");

  const [clinicEmail, setClinicEmail] = useState("hello@lovelleclinic.com");

  const [clinicPhone, setClinicPhone] = useState("(416) 555-0198");

  const [defaultDuration, setDefaultDuration] = useState("60 minutes");

  const [profileSaved, setProfileSaved] = useState(false);

  const [settingsLoading, setSettingsLoading] = useState(true);

  const [settingsSaving, setSettingsSaving] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {

    const unsubscribe = onSnapshot(
      doc(db, "workspaceSettings", "main"),
      (docSnap) => {

        if (docSnap.exists()) {

          const settings = docSnap.data();

          setClinicName(settings.clinicName || "Lovelle Clinic");
          setClinicEmail(settings.clinicEmail || "hello@lovelleclinic.com");
          setClinicPhone(settings.clinicPhone || "(416) 555-0198");
          setDefaultDuration(settings.defaultDuration || "60 minutes");

        }

        setSettingsLoading(false);

      }
    );

    return () => unsubscribe();

  }, []);

  async function saveSettings() {

    try {

      setSettingsSaving(true);

      await setDoc(
        doc(db, "workspaceSettings", "main"),
        {
          clinicName,
          clinicEmail,
          clinicPhone,
          workspaceType: "Luxury Medspa",
          defaultDuration,
          updatedAt: serverTimestamp()
        },
        {
          merge: true
        }
      );

      setProfileSaved(true);

      window.setTimeout(() => {

        setProfileSaved(false);

      }, 2400);

    } catch (error) {

      alert(error.message);

    } finally {

      setSettingsSaving(false);

    }

  }

  return (

    <Layout>

      <div className="mb-10">

        <PageHeader
          eyebrow="Workspace Settings"
          title="Settings"
          description="
            Configure the clinic workspace, appointment defaults,
            and account preferences for a polished daily workflow.
          "
        >

          {settingsLoading ? (

            <Badge variant="light">

              Loading

            </Badge>

          ) : profileSaved && (

            <Badge variant="light">

              <Check size={16} />

              Saved to Firestore

            </Badge>

          )}

        </PageHeader>

      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_420px] gap-8">

        <div className="space-y-8">

          {/* CLINIC PROFILE */}

          {settingsLoading ? (

            <LoadingCard />

          ) : (

          <Card>

            <div className="flex items-start justify-between gap-4 mb-8">

              <SectionHeader
                eyebrow="Clinic Profile"
                title="Workspace Details"
                subtitle="These details help keep the workspace clear and consistent."
              />

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#f5f5f4]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <Building2 size={22} />

              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <div>

                <p className="text-gray-500 mb-3">
                  Clinic Name
                </p>

                <Input
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />

              </div>

              <div>

                <p className="text-gray-500 mb-3">
                  Contact Email
                </p>

                <Input
                  type="email"
                  value={clinicEmail}
                  onChange={(e) => setClinicEmail(e.target.value)}
                />

              </div>

              <div>

                <p className="text-gray-500 mb-3">
                  Phone Number
                </p>

                <Input
                  value={clinicPhone}
                  onChange={(e) => setClinicPhone(e.target.value)}
                />

              </div>

              <div>

                <p className="text-gray-500 mb-3">
                  Workspace Type
                </p>

                <div
                  className="
                    vela-input
                    flex
                    items-center
                    justify-between
                    text-gray-600
                  "
                >

                  Luxury Medspa

                  <Badge
                    variant="light"
                    className="px-4 py-2 text-xs"
                  >
                    Default
                  </Badge>

                </div>

              </div>

            </div>

            <Button
              onClick={saveSettings}
              disabled={settingsSaving}
              className="mt-6"
            >
              {settingsSaving ? "Saving..." : "Save Settings"}
            </Button>

          </Card>

          )}

          {/* APPOINTMENT PREFERENCES */}

          <Card>

            <SectionHeader
              eyebrow="Scheduling"
              title="Appointment Preferences"
              subtitle="This default is used when booking new appointments."
            />

            <div className="mt-4">

              <SettingRow
                icon={CalendarClock}
                title="Default Appointment Length"
                description="Used as the starting point when creating new bookings."
              >

                <select
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  className="
                    vela-input
                    min-w-[190px]
                    appearance-none
                  "
                >

                  {appointmentDurations.map((duration) => (

                    <option
                      key={duration}
                      value={duration}
                    >
                      {duration}
                    </option>

                  ))}

                </select>

              </SettingRow>

            </div>

          </Card>

        </div>

        <div className="space-y-8">

          {/* ACCOUNT */}

          <Card>

            <SectionHeader
              eyebrow="Account"
              title="Signed In"
            />

            <div
              className="
                mt-8
                rounded-[28px]
                border
                border-black/[0.04]
                bg-[#fcfcfb]
                p-6
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#f5f5f4]
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >

                <UserRound size={22} />

              </div>

              <p className="text-xl font-semibold">
                Clinic Admin
              </p>

              <div className="flex items-center gap-3 mt-3 text-gray-500">

                <Mail size={16} />

                <p className="break-all">
                  {currentUser?.email || "Signed in account"}
                </p>

              </div>

            </div>

          </Card>

          {/* SECURITY */}

          <Card>

            <SectionHeader
              eyebrow="Security"
              title="Access"
              subtitle="Authentication is managed through Firebase."
            />

            <div className="space-y-4 mt-8">

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-[24px]
                  border
                  border-black/[0.04]
                  bg-[#fcfcfb]
                  p-5
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-[#f5f5f4]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <Lock size={18} />

                  </div>

                  <div>

                    <p className="font-semibold">
                      Protected Routes
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Login is required before entering Lovelle.
                    </p>

                  </div>

                </div>

                <Badge
                  variant="light"
                  className="px-4 py-2 text-xs"
                >
                  Active
                </Badge>

              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-[24px]
                  border
                  border-black/[0.04]
                  bg-[#fcfcfb]
                  p-5
                "
              >

                <div className="flex items-center gap-4">

                  <div
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-[#f5f5f4]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <Shield size={18} />

                  </div>

                  <div>

                    <p className="font-semibold">
                      Firestore Data
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Clients and appointments use live listeners.
                    </p>

                  </div>

                </div>

                <Badge
                  variant="light"
                  className="px-4 py-2 text-xs"
                >
                  Connected
                </Badge>

              </div>

            </div>

          </Card>

        </div>

      </div>

    </Layout>

  );

}
