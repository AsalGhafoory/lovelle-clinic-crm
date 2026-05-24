import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import {
  Search,
  Users
} from "lucide-react";

import { db } from "../firebase";

import Layout from "../components/Layout";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import SectionHeader from "../components/ui/SectionHeader";
import PageHeader from "../components/ui/PageHeader";
import LoadingCard from "../components/ui/LoadingCard";

export default function Clients() {

  const [clients, setClients] = useState([]);

  const [search, setSearch] = useState("");

  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {

        const clientArray = [];

        snapshot.forEach((doc) => {

          clientArray.push({
            id: doc.id,
            ...doc.data()
          });

        });

        setClients(clientArray);
        setClientsLoading(false);

      }
    );

    return () => unsubscribe();

  }, []);

  const filteredClients = useMemo(() => {

    return clients.filter((client) => {

      return (

        client.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        client.email
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    });

  }, [clients, search]);

  return (

    <Layout>

      <div className="mb-10">

        <PageHeader
          eyebrow="Client Management"
          title="Clients"
          description="
            Manage client relationships,
            profiles, notes, and wellness history.
          "
        />

      </div>

      {/* SEARCH + COUNT */}

      <Card className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

          <SectionHeader
            eyebrow="Directory"
            title="Client Directory"
          />

          <Badge variant="light">

            {filteredClients.length} Clients

          </Badge>

        </div>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />

        </div>

      </Card>

      {/* CLIENT GRID */}

      {clientsLoading ? (

        <LoadingCard />

      ) : filteredClients.length === 0 ? (

        <Card>

          <EmptyState
            title="No Clients Found"
            description="
              Try adjusting your search
              or begin by adding your first client.
            "
            actionLabel="Add Client"
            actionTo="/"
          />

        </Card>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {filteredClients.map((client) => (

            <Link
              key={client.id}
              to={`/client/${client.id}`}
            >

              <Card className="hover:-translate-y-[2px] transition-all duration-300 hover:shadow-lg">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="text-2xl font-semibold truncate">
                      {client.name}
                    </p>

                    <p className="text-gray-500 mt-2 truncate">
                      {client.email}
                    </p>

                  </div>

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-[#f3f3f0]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >

                    <Users size={20} />

                  </div>

                </div>

                {client.tags?.length > 0 && (

                  <div className="flex flex-wrap gap-3 mt-6">

                    {client.tags.map((tag) => (

                      <div
                        key={tag}
                        className="vela-tag"
                      >

                        {tag}

                      </div>

                    ))}

                  </div>

                )}

              </Card>

            </Link>

          ))}

        </div>

      )}

    </Layout>

  );

}
